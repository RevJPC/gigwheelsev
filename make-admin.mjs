import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json' with { type: 'json' };

Amplify.configure(outputs);

const client = generateClient({
    authMode: 'apiKey'
});

async function listAndMakeAdmin() {
    console.log('Fetching all users...\n');
    
    try {
        const users = await client.models.UserProfile.list();

        if (users.data.length === 0) {
            console.log('No users found in database.');
            console.log('\nCreating admin profile for jamiececil@gmail.com...');
            
            // Create admin profile manually
            const newAdmin = await client.models.UserProfile.create({
                userId: 'manual-admin-' + Date.now(), // Temporary userId
                email: 'jamiececil@gmail.com',
                name: 'Jamie Cecil',
                role: 'ADMIN'
            });
            
            console.log('✅ Created admin profile!');
            console.log('Note: You may need to update the userId after next login.');
            return;
        }

        console.log(`Found ${users.data.length} user(s):\n`);
        users.data.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'No name'} (${user.email}) - Role: ${user.role}`);
        });

        // Auto-promote first user to admin if email matches
        const targetUser = users.data.find(u => u.email === 'jamiececil@gmail.com');
        
        if (targetUser) {
            console.log(`\nPromoting ${targetUser.email} to ADMIN...`);
            await client.models.UserProfile.update({
                id: targetUser.id,
                role: 'ADMIN'
            });
            console.log('✅ Successfully promoted to ADMIN!');
        } else {
            console.log('\njamiececil@gmail.com not found. Promoting first user to admin...');
            const firstUser = users.data[0];
            await client.models.UserProfile.update({
                id: firstUser.id,
                role: 'ADMIN'
            });
            console.log(`✅ Promoted ${firstUser.email} to ADMIN!`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

listAndMakeAdmin();
