import { defineAuth, secret } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
    loginWith: {
        email: true,
        externalProviders: {
            google: {
                clientId: secret('GOOGLE_CLIENT_ID'),
                clientSecret: secret('GOOGLE_CLIENT_SECRET'),
                scopes: ['email', 'profile'],
                attributeMapping: {
                    email: 'email'
                }
            },
            // facebook: {
            //     clientId: secret('FACEBOOK_CLIENT_ID'),
            //     clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
            //     scopes: ['public_profile', 'email']
            // },
            callbackUrls: [
                'http://localhost:3000/oauth2/idpresponse',
                'https://master.d2j2484950395.amplifyapp.com/oauth2/idpresponse' // Update this with your actual production URL when known
            ],
            logoutUrls: ['http://localhost:3000/', 'https://master.d2j2484950395.amplifyapp.com/']
        }
    },
    userAttributes: {
        "custom:role": {
            dataType: "String",
            mutable: true,
        }
    }
});
