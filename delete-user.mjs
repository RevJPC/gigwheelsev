import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json' with { type: 'json' };

Amplify.configure(outputs);

const client = generateClient({
    authMode: 'apiKey'
});

async function deleteUser() {
    const userId = process.argv[2];

    if (!userId) {
        console.log('Usage: node delete-user.mjs <user-id>');
        console.log('\nListing all users:\n');

        const users = await client.models.UserProfile.list();
        users.data.forEach((user, index) => {
            console.log(`${index + 1}. ${user.email} (${user.role})`);
            console.log(`   ID: ${user.id}`);
            console.log(`   UserId: ${user.userId}`);
            console.log('');
        });

        console.log('Run: node delete-user.mjs <ID>');
        return;
    }

    try {
        console.log(`Deleting user with ID: ${userId}`);
        await client.models.UserProfile.delete({ id: userId });
        console.log('✅ User deleted successfully!');
    } catch (error) {
        console.error('Error:', error);
    }
}

deleteUser();
