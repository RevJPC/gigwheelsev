import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'vehicleImages',
    access: (allow) => ({
        'public/*': [
            allow.authenticated.to(['read', 'write', 'delete']),
            allow.guest.to(['read'])
        ],
        'profile-pictures/{entity_id}/*': [
            allow.entity('identity').to(['read', 'write', 'delete']),
            allow.guest.to(['read']),
            allow.authenticated.to(['read'])
        ]
    })
});
