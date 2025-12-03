import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json' assert { type: 'json' };

Amplify.configure(outputs);

const client = generateClient({
    authMode: 'apiKey'
});

async function checkVehicles() {
    try {
        const { data: vehicles } = await client.models.Vehicle.list();

        console.log(`\nFound ${vehicles.length} vehicles:\n`);

        vehicles.forEach(v => {
            console.log(`${v.year} ${v.make} ${v.model}`);
            console.log(`  VIN: ${v.vin}`);
            console.log(`  Battery: ${v.batteryLevel !== null ? v.batteryLevel + '%' : 'NO DATA'}`);
            console.log(`  Range: ${v.range !== null ? v.range + ' mi' : 'NO DATA'}`);
            console.log(`  Location: ${v.locationLat && v.locationLng ? `${v.locationLat}, ${v.locationLng}` : 'NO DATA'}`);
            console.log('');
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

checkVehicles();
