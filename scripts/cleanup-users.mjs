import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { readFileSync } from "fs";

const outputs = JSON.parse(readFileSync("./amplify_outputs.json", "utf-8"));

Amplify.configure(outputs);
const client = generateClient();

const KEEP_EMAIL = "jamiececil@gmail.com";

async function thoroughCleanup() {
    console.log("=== THOROUGH USER CLEANUP ===");
    console.log(`Will keep user: ${KEEP_EMAIL}\n`);

    try {
        // 1. Get all UserProfiles from database
        const { data: profiles } = await client.models.UserProfile.list();
        console.log(`Found ${profiles.length} profiles in database\n`);

        // 2. Delete each user properly
        let deletedCount = 0;
        let keptCount = 0;
        let failedCount = 0;

        for (const profile of profiles) {
            if (profile.email === KEEP_EMAIL) {
                console.log(`✓ KEEPING: ${profile.email}`);
                keptCount++;
                continue;
            }

            console.log(`\nDELETING: ${profile.email}`);
            console.log(`  User ID: ${profile.userId}`);
            console.log(`  Profile ID: ${profile.id}`);

            try {
                // Use the deleteUser mutation which should handle Cognito deletion
                console.log(`  Calling deleteUser mutation...`);
                const result = await client.mutations.deleteUser({
                    userId: profile.userId
                });

                console.log(`  Mutation result:`, result);

                if (result.errors && result.errors.length > 0) {
                    console.error(`  ✗ Mutation errors:`, result.errors);
                    failedCount++;
                } else {
                    console.log(`  ✓ Cognito user deleted`);
                }
            } catch (mutationError) {
                console.error(`  ✗ Mutation exception:`, mutationError);
                failedCount++;
            }

            try {
                // Delete from database
                console.log(`  Deleting UserProfile from database...`);
                await client.models.UserProfile.delete({ id: profile.id });
                console.log(`  ✓ Database profile deleted`);
                deletedCount++;
            } catch (dbError) {
                console.error(`  ✗ Database error:`, dbError);
                failedCount++;
            }
        }

        console.log("\n=== CLEANUP SUMMARY ===");
        console.log(`✓ Deleted: ${deletedCount} users`);
        console.log(`✓ Kept: ${keptCount} user (${KEEP_EMAIL})`);
        if (failedCount > 0) {
            console.log(`✗ Failed: ${failedCount} operations`);
        }
        console.log("\n✅ Cleanup complete!");

    } catch (error) {
        console.error("\n❌ Fatal error during cleanup:", error);
        process.exit(1);
    }
}

thoroughCleanup();
