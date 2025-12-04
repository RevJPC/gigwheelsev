import type { Handler } from 'aws-lambda';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../data/resource';

import { Amplify } from 'aws-amplify';

Amplify.configure({
    API: {
        GraphQL: {
            endpoint: process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT!,
            region: process.env.AWS_REGION,
            defaultAuthMode: 'apiKey',
            apiKey: process.env.AMPLIFY_DATA_API_KEY!
        }
    }
});

const client = generateClient<Schema>({
    authMode: 'apiKey'
});

export const handler: Handler = async (event) => {
    // Debug: Check what env vars we have
    console.log('Environment variables:', {
        hasEndpoint: !!process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT,
        hasApiKey: !!process.env.AMPLIFY_DATA_API_KEY,
        hasRegion: !!process.env.AWS_REGION
    });

    try {
        // 1. Get the access token from the database using raw GraphQL
        const listIntegrationsQuery = `
            query ListTeslaIntegrations {
                listTeslaIntegrations {
                    items {
                        accessToken
                    }
                }
            }
        `;

        const integrationResponse = await client.graphql({
            query: listIntegrationsQuery
        });

        const integrations = (integrationResponse as any).data?.listTeslaIntegrations?.items || [];

        if (integrations.length === 0) {
            return { statusCode: 400, body: "No Tesla integration found" };
        }

        const integration = integrations[0];
        const accessToken = integration.accessToken;

        // 2. Fetch vehicles from Tesla API
        const vehiclesResponse = await fetch('https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!vehiclesResponse.ok) {
            const error = await vehiclesResponse.text();
            console.error("Tesla API Error:", error);
            return { statusCode: vehiclesResponse.status, body: `Tesla API Error: ${error}` };
        }

        const { response: teslaVehicles } = await vehiclesResponse.json();

        // 3. Sync with local database
        const syncedVehicles = [];
        const debugLogs: string[] = [];

        for (const tv of teslaVehicles) {
            // Fetch detailed vehicle data
            let vehicleData = null;
            let firmwareVersion = null;
            let inService = tv.in_service;

            try {
                const params = new URLSearchParams();
                params.append('endpoints', 'charge_state;drive_state;vehicle_state;vehicle_config;gui_settings;climate_state');

                console.log(`Fetching data for vehicle ID: ${tv.id}, VIN: ${tv.vin}`);
                const dataResponse = await fetch(`https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${tv.id}/vehicle_data?${params.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (dataResponse.ok) {
                    const dataJson = await dataResponse.json();
                    vehicleData = dataJson.response;
                    console.log(`✅ Fetched data for ${tv.vin}`);
                    console.log(`Response Keys: ${Object.keys(vehicleData).join(', ')}`);

                    if (vehicleData.drive_state) {
                        console.log(`Drive State: ${JSON.stringify(vehicleData.drive_state)}`);
                    } else {
                        console.log(`❌ drive_state is MISSING from response. Attempting fallback fetch...`);
                        try {
                            const driveParams = new URLSearchParams();
                            driveParams.append('endpoints', 'drive_state');

                            const driveResponse = await fetch(`https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${tv.id}/vehicle_data?${driveParams.toString()}`, {
                                headers: {
                                    'Authorization': `Bearer ${accessToken}`,
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (driveResponse.ok) {
                                const driveJson = await driveResponse.json();
                                // Merge the drive_state into vehicleData
                                if (driveJson.response && driveJson.response.drive_state) {
                                    vehicleData.drive_state = driveJson.response.drive_state;
                                    console.log(`✅ Fallback drive_state fetch SUCCESS: ${JSON.stringify(vehicleData.drive_state)}`);
                                } else {
                                    console.log(`❌ Fallback response missing drive_state: ${JSON.stringify(driveJson)}`);
                                }
                            } else {
                                console.log(`❌ Fallback drive_state fetch FAILED: ${driveResponse.status}`);
                            }
                        } catch (err) {
                            console.error("Error in fallback drive_state fetch:", err);
                        }
                    }

                    debugLogs.push(`Battery: ${vehicleData?.charge_state?.battery_level}%, Range: ${vehicleData?.charge_state?.battery_range} mi`);
                } else {
                    debugLogs.push(`Could not fetch data for ${tv.vin}, using basic info only`);
                }

                // Fetch Fleet Status for Firmware Version
                try {
                    const fleetStatusResponse = await fetch(`https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/fleet_status`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ vins: [tv.vin] })
                    });

                    if (fleetStatusResponse.ok) {
                        const fleetStatusJson = await fleetStatusResponse.json();

                        // Check for unpaired VINs
                        if (fleetStatusJson.response?.unpaired_vins?.includes(tv.vin)) {
                            debugLogs.push(`⚠️ VIN ${tv.vin} is UNPAIRED. Some commands/data may fail.`);
                        }

                        // Extract firmware version from vehicle_info
                        if (fleetStatusJson.response?.vehicle_info?.[tv.vin]) {
                            firmwareVersion = fleetStatusJson.response.vehicle_info[tv.vin].firmware_version;
                            debugLogs.push(`✅ Fetched firmware version for ${tv.vin}: ${firmwareVersion}`);
                        } else {
                            debugLogs.push(`⚠️ Firmware version not found in fleet status for ${tv.vin}: ${JSON.stringify(fleetStatusJson)}`);
                        }
                    } else {
                        debugLogs.push(`❌ Failed to fetch fleet status for ${tv.vin}: ${fleetStatusResponse.status} ${await fleetStatusResponse.text()}`);
                    }
                } catch (err) {
                    debugLogs.push(`Error fetching fleet status for ${tv.vin}: ${err}`);
                }

                // Fetch Service Data for Maintenance Status
                try {
                    const serviceDataResponse = await fetch(`https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${tv.id}/service_data`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (serviceDataResponse.ok) {
                        const serviceDataJson = await serviceDataResponse.json();
                        if (serviceDataJson.response && serviceDataJson.response.service_mode) {
                            inService = true;
                            console.log(`⚠️ Vehicle ${tv.vin} is in SERVICE MODE`);
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching service data for ${tv.vin}:`, err);
                }

            } catch (error) {
                console.error(`Error fetching vehicle data for ${tv.vin}:`, error);
            }

            // Check if vehicle already exists
            const listVehiclesQuery = `
                query ListVehicles($filter: ModelVehicleFilterInput) {
                    listVehicles(filter: $filter) {
                        items {
                            id
                            vin
                        }
                    }
                }
            `;

            const existingResponse = await client.graphql({
                query: listVehiclesQuery,
                variables: {
                    filter: { vin: { eq: tv.vin } }
                }
            });

            const existing = (existingResponse as any).data?.listVehicles?.items || [];

            if (existing.length > 0) {
                // Update existing
                const v = existing[0];
                const updateVehicleMutation = `
                    mutation UpdateVehicle($input: UpdateVehicleInput!) {
                        updateVehicle(input: $input) {
                            id
                            vin
                        }
                    }
                `;

                // Map Tesla state to our status
                let status = 'AVAILABLE';
                if (inService) {
                    status = 'MAINTENANCE';
                } else if (tv.state === 'asleep' || tv.state === 'offline') {
                    status = 'AVAILABLE'; // Car is just sleeping, still available
                } else if (tv.state === 'online') {
                    status = 'AVAILABLE';
                }

                await client.graphql({
                    query: updateVehicleMutation,
                    variables: {
                        input: {
                            id: v.id,
                            batteryLevel: vehicleData?.charge_state?.battery_level || null,
                            range: vehicleData?.charge_state?.battery_range || null,
                            locationLat: vehicleData?.drive_state?.latitude || null,
                            locationLng: vehicleData?.drive_state?.longitude || null,
                            color: vehicleData?.vehicle_config?.exterior_color || null,
                            status: status,
                            firmwareVersion: firmwareVersion,
                            lastSyncedAt: new Date().toISOString()
                        }
                    }
                });
                syncedVehicles.push(`Updated ${v.vin}`);
            } else {
                // Create new
                const createVehicleMutation = `
                    mutation CreateVehicle($input: CreateVehicleInput!) {
                        createVehicle(input: $input) {
                            id
                            vin
                        }
                    }
                `;

                // Extract year from VIN (10th character)
                const vinYearCode = tv.vin[9];
                const yearMap: { [key: string]: number } = {
                    'M': 2021, 'N': 2022, 'P': 2023, 'R': 2024, 'S': 2025,
                    'T': 2026, 'V': 2027, 'W': 2028, 'X': 2029, 'Y': 2030
                };
                const year = yearMap[vinYearCode] || 2023;

                // Map Tesla state to our status
                let status = 'AVAILABLE';
                if (inService) {
                    status = 'MAINTENANCE';
                }

                await client.graphql({
                    query: createVehicleMutation,
                    variables: {
                        input: {
                            make: "Tesla",
                            model: "Model " + (tv.vin[3] || "X"),
                            year: year,
                            vin: tv.vin,
                            batteryLevel: vehicleData?.charge_state?.battery_level || null,
                            range: vehicleData?.charge_state?.battery_range || null,
                            locationLat: vehicleData?.drive_state?.latitude || null,
                            locationLng: vehicleData?.drive_state?.longitude || null,
                            color: vehicleData?.vehicle_config?.exterior_color || null,
                            status: status,
                            pricePerDay: 150,
                            firmwareVersion: firmwareVersion,
                            lastSyncedAt: new Date().toISOString()
                        }
                    }
                });
                syncedVehicles.push(`Created ${tv.vin}`);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Sync complete", details: syncedVehicles, logs: debugLogs })
        };

    } catch (error) {
        console.error("Sync Error:", error);
        return { statusCode: 500, body: String(error) };
    }
};
