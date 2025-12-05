import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json' with { type: 'json' };

Amplify.configure(outputs);

const client = generateClient({
    authMode: 'apiKey'
});

async function cleanupDuplicates() {
    console.log('Fetching all users...\n');

    try {
        const users = await client.models.UserProfile.list();
        const jamieCecilUsers = users.data.filter(u => u.email === 'jamiececil@gmail.com');

        if (jamieCecilUsers.length === 0) {
            console.log('No users found with email jamiececil@gmail.com');
            return;
        }

        console.log(`Found ${jamieCecilUsers.length} user(s) with email jamiececil@gmail.com:\n`);
        jamieCecilUsers.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id}`);
            console.log(`   UserId: ${user.userId}`);
            console.log(`   Name: ${user.name || 'No name'}`);
            console.log(`   Role: ${user.role}`);
            console.log('');
        });

        // Find the manual one (has 'manual-admin' in userId)
        const manualUser = jamieCecilUsers.find(u => u.userId.startsWith('manual-admin'));
        const realUser = jamieCecilUsers.find(u => !u.userId.startsWith('manual-admin'));

        if (manualUser && realUser) {
            console.log('Deleting the manual duplicate...');
            await client.models.UserProfile.delete({ id: manualUser.id });
            console.log('✅ Deleted manual duplicate!');

            console.log('\nUpdating real user to ADMIN...');
            await client.models.UserProfile.update({
                id: realUser.id,
                role: 'ADMIN'
            });
            console.log('✅ Updated real user to ADMIN!');
            console.log('\nYou now have one user with ADMIN role.');
            console.log('Log out and log back in to access /admin');
        } else if (jamieCecilUsers.length > 1) {
            console.log('Multiple users found, but cannot determine which is duplicate.');
            console.log('Please manually delete one using the ID above.');
        } else {
            console.log('Only one user found. Ensuring ADMIN role...');
            await client.models.UserProfile.update({
                id: jamieCecilUsers[0].id,
                role: 'ADMIN'
            });
            console.log('✅ Updated to ADMIN!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

cleanupDuplicates();
