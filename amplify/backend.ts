import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { teslaConnect } from './functions/tesla-connect/resource';
import { teslaSync } from './functions/tesla-sync/resource';
import { teslaRegister } from './functions/tesla-register/resource';
import { deleteUser } from './functions/delete-user/resource';
import { sendChangeEmail } from './functions/send-change-email/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
const backend = defineBackend({
    auth,
    data,
    storage,
    teslaConnect,
    teslaSync,
    teslaRegister,
    deleteUser,
    sendChangeEmail,
});

const { cfnFunction } = backend.teslaSync.resources.lambda as any;
// The Amplify Gen 2 types are a bit strict, but the underlying resources are CDK constructs.
// We can try to access the environment variables via the L1 construct or try to access the environment variables via the L1 construct or try to cast to NodejsFunction if we import it.
// However, a safer way in Gen 2 is often to use the `env` object if available or just use `addEnvironment` by casting to `Function`.

import { Function } from 'aws-cdk-lib/aws-lambda';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

const lambdaFunction = backend.teslaSync.resources.lambda as unknown as Function;
const lambdaRegister = backend.teslaRegister.resources.lambda as unknown as Function;
const deleteUserLambda = backend.deleteUser.resources.lambda as unknown as Function;

const { cfnGraphqlApi } = backend.data.resources.cfnResources;

// Pass the GraphQL Endpoint and API Key to both Lambdas
lambdaFunction.addEnvironment('AMPLIFY_DATA_GRAPHQL_ENDPOINT', cfnGraphqlApi.attrGraphQlUrl);
lambdaRegister.addEnvironment('AMPLIFY_DATA_GRAPHQL_ENDPOINT', cfnGraphqlApi.attrGraphQlUrl);

// Access the API key from the CFN resources
const apiKeyValue = backend.data.resources.cfnResources.cfnApiKey?.attrApiKey;
if (apiKeyValue) {
    lambdaFunction.addEnvironment('AMPLIFY_DATA_API_KEY', apiKeyValue);
    lambdaRegister.addEnvironment('AMPLIFY_DATA_API_KEY', apiKeyValue);
}

// Grant permission to delete users from Cognito
const deleteUserPolicy = new PolicyStatement({
    actions: ['cognito-idp:AdminDeleteUser'],
    resources: [backend.auth.resources.userPool.userPoolArn],
});
deleteUserLambda.addToRolePolicy(deleteUserPolicy);

// Add User Pool ID as environment variable
deleteUserLambda.addEnvironment('AMPLIFY_AUTH_USERPOOL_ID', backend.auth.resources.userPool.userPoolId);
