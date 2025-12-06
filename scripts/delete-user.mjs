import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { readFileSync } from "fs";

const outputs = JSON.parse(readFileSync("./amplify_outputs.json", "utf-8"));

Amplify.configure(outputs);
const client = generateClient();

const EMAIL_TO_DELETE = "crystalcecil@hotmail.com";

async function deleteSpecificUser() {
    console.log(`=== DELETING USER: ${EMAIL_TO_DELETE} ===\n`);

    try {
        // 1. Check if UserProfile exists
        const { data: profiles } = await client.models.UserProfile.list({
            filter: {
                email: { eq: EMAIL_TO_DELETE }
            }
        });

        if (profiles.length === 0) {
            console.log("⚠ No UserProfile found in database for this email");
            console.log("This means the user exists in Cognito but not in the database (orphaned)");
            console.log("\nYou have two options:");
            console.log("1. Complete the signup by going through the 'Forgot Password' flow");
            console.log("2. Contact AWS support to delete the Cognito user manually");
            console.log("\nOr just use a different email address for testing.");
            return;
        }

        const profile = profiles[0];
        console.log(`Found UserProfile:`);
        console.log(`  Email: ${profile.email}`);
        console.log(`  User ID: ${profile.userId}`);
        console.log(`  Profile ID: ${profile.id}\n`);

        // 2. Delete from Cognito using mutation
        console.log("Deleting from Cognito...");
        const { data: deleteResult, errors: deleteErrors } = await client.mutations.deleteUser({
            userId: profile.userId
        });

        if (deleteErrors && deleteErrors.length > 0) {
            console.error("✗ Error deleting from Cognito:", deleteErrors);
        } else {
            console.log("✓ Deleted from Cognito");
            console.log("  Result:", deleteResult);
        }

        // 3. Delete from database
        console.log("\nDeleting from database...");
        await client.models.UserProfile.delete({ id: profile.id });
        console.log("✓ Deleted from database");

        console.log("\n✅ User completely deleted!");
        console.log(`You can now create a fresh account with ${EMAIL_TO_DELETE}`);

    } catch (error) {
        console.error("\n❌ Error:", error);
        process.exit(1);
    }
}

deleteSpecificUser();
