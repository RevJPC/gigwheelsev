import { generateClient } from 'aws-amplify/data';
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json' with { type: 'json' };

Amplify.configure(outputs);

const client = generateClient({
    authMode: 'apiKey'
});

async function makeAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.error('Usage: node make-admin.mjs <email>');
        process.exit(1);
    }

    console.log(`Looking for user with email: ${email}`);

    try {
        // Find user by email
        const users = await client.models.UserProfile.list({
            filter: { email: { eq: email } }
        });

        if (users.data.length === 0) {
            console.error(`No user found with email: ${email}`);
            console.log('Make sure the user has signed up first!');
            process.exit(1);
        }

        const user = users.data[0];
        console.log(`Found user: ${user.name} (${user.email})`);
        console.log(`Current role: ${user.role}`);

        // Update to admin
        await client.models.UserProfile.update({
            id: user.id,
            role: 'ADMIN'
        });

        console.log('✅ Successfully promoted user to ADMIN!');
        console.log('The user will be redirected to /admin on next login.');
    } catch (error) {
        console.error('Error:', error);
    }
}

makeAdmin();
