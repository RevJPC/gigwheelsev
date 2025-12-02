import type { Handler } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../data/resource';

const client = generateClient<Schema>();

export const handler: Handler = async (event) => {
    const { code, redirectUri } = event.arguments || {};

    // Access secrets from process.env (Amplify injects them)
    const TESLA_CLIENT_ID = process.env.TESLA_CLIENT_ID;
    const TESLA_CLIENT_SECRET = process.env.TESLA_CLIENT_SECRET;

    if (!TESLA_CLIENT_ID || !TESLA_CLIENT_SECRET) {
        throw new Error("Missing Tesla credentials in environment variables");
    }

    // If no code is provided, return the Auth URL to start the flow
    if (!code) {
        const scope = 'openid offline_access vehicle_device_data vehicle_cmds vehicle_charging_cmds';
        // Default to localhost for dev, but allow override
        const redirect = redirectUri || 'http://localhost:3000/admin/settings/callback';
        // Random state for security (should be validated on callback in a real app)
        const state = Math.random().toString(36).substring(7);

        const authUrl = `https://auth.tesla.com/oauth2/v3/authorize?client_id=${TESLA_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;

        return { authUrl };
    }

    try {
        const tokenResponse = await fetch('https://auth.tesla.com/oauth2/v3/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                grant_type: 'authorization_code',
                client_id: TESLA_CLIENT_ID,
                client_secret: TESLA_CLIENT_SECRET,
                code: code,
                redirect_uri: redirectUri || 'http://localhost:3000/admin/settings/callback',
                audience: 'fleet_api'
            })
        });

        const tokens = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Tesla Token Error:', tokens);
            throw new Error(tokens.error_description || 'Failed to exchange token');
        }

        return tokens;

    } catch (error) {
        console.error(error);
        throw new Error(String(error));
    }
};
