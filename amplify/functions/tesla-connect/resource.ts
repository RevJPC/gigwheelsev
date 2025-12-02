import { defineFunction, secret } from '@aws-amplify/backend';

export const teslaConnect = defineFunction({
    name: 'tesla-connect',
    environment: {
        TESLA_CLIENT_ID: secret('TESLA_CLIENT_ID'),
        TESLA_CLIENT_SECRET: secret('TESLA_CLIENT_SECRET'),
        REDIRECT_URI: 'http://localhost:3000/admin/settings/callback' // TODO: Make dynamic for prod
    }
});
