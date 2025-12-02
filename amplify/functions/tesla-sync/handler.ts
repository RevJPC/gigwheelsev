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
        for (const tv of teslaVehicles) {
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

                await client.graphql({
                    query: updateVehicleMutation,
                    variables: {
                        input: {
                            id: v.id,
                            batteryLevel: tv.charge_state?.battery_level,
                            range: tv.charge_state?.battery_range,
                            locationLat: tv.drive_state?.latitude,
                            locationLng: tv.drive_state?.longitude,
                            status: tv.state === 'online' ? 'AVAILABLE' : 'MAINTENANCE'
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

                await client.graphql({
                    query: createVehicleMutation,
                    variables: {
                        input: {
                            make: "Tesla",
                            model: "Model " + (tv.vin[3] || "X"),
                            year: 2023,
                            vin: tv.vin,
                            batteryLevel: tv.charge_state?.battery_level,
                            range: tv.charge_state?.battery_range,
                            status: 'AVAILABLE',
                            pricePerDay: 150
                        }
                    }
                });
                syncedVehicles.push(`Created ${tv.vin}`);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Sync complete", details: syncedVehicles })
        };

    } catch (error) {
        console.error("Sync Error:", error);
        return { statusCode: 500, body: String(error) };
    }
};
