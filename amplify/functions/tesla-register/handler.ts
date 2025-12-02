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
    console.log('Tesla Register function called');

    try {
        // Get the access token from the database
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
            return { statusCode: 400, body: JSON.stringify({ error: "No Tesla integration found" }) };
        }

        const accessToken = integrations[0].accessToken;

        // Parse domain from event if provided, otherwise use a default
        const eventBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body || {};
        const domain = eventBody.domain || 'http://localhost:3000';

        console.log('Registering with domain:', domain);

        // Call Tesla's partner account registration endpoint
        const response = await fetch('https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/partner_accounts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                domain: domain
            })
        });

        const responseText = await response.text();
        console.log('Tesla registration response:', response.status, responseText);

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: "Successfully registered with Tesla Fleet API",
                    details: responseText
                })
            };
        } else {
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: "Registration failed",
                    details: responseText
                })
            };
        }

    } catch (error) {
        console.error("Registration Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: String(error) })
        };
    }
};
