// Quick script to fetch your Tesla access token from the database
import { generateClient } from 'aws-amplify/data';
import type { Schema } from './amplify/data/resource.js';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json' assert { type: 'json' };

Amplify.configure(outputs);

const client = generateClient < Schema > ({
    authMode: 'apiKey'
});

async function getToken() {
    try {
        const { data: integrations } = await client.models.TeslaIntegration.list();

        if (integrations && integrations.length > 0) {
            console.log('Access Token:', integrations[0].accessToken);
        } else {
            console.log('No Tesla integration found in database.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

getToken();
