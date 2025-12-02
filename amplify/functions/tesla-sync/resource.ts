import { defineFunction, secret } from '@aws-amplify/backend';

export const teslaSync = defineFunction({
    name: 'tesla-sync',
    environment: {
        TESLA_CLIENT_ID: secret('TESLA_CLIENT_ID'),
        TESLA_CLIENT_SECRET: secret('TESLA_CLIENT_SECRET'),
    },
    timeoutSeconds: 60, // Sync might take a while
    resourceGroupName: 'data'
});
