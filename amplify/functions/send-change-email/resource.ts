import { defineFunction } from '@aws-amplify/backend';

export const sendChangeEmail = defineFunction({
    name: 'send-change-email',
    entry: './handler.ts',
    environment: {
        SES_FROM_EMAIL: 'noreply@gigwheelsev.com'
    }
});
