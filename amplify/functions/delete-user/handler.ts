import { CognitoIdentityProviderClient, AdminDeleteUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient();

export const handler = async (event: any) => {
    const { userId } = event.arguments;
    const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

    if (!userPoolId) {
        throw new Error("User Pool ID not configured");
    }

    try {
        const command = new AdminDeleteUserCommand({
            UserPoolId: userPoolId,
            Username: userId
        });

        await client.send(command);
        return { success: true };
    } catch (error) {
        console.error('Error deleting user from Cognito:', error);
        throw error;
    }
};
