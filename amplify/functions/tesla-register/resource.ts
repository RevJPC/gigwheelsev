import { defineFunction } from '@aws-amplify/backend';

export const teslaRegister = defineFunction({
    name: 'tesla-register',
    timeoutSeconds: 30,
    resourceGroupName: 'data'
});
