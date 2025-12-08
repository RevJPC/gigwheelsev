import { generateClient } from "aws-amplify/data";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import type { Schema } from "@/amplify/data/resource";

// Lazy load client to avoid eager configuration issues
const getClient = () => generateClient<Schema>();

export type UserRole = 'admin' | 'employee' | 'customer';

export async function getUserRole(): Promise<UserRole> {
    const user = await getCurrentUser();
    let userAttributes;
    try {
        userAttributes = await fetchUserAttributes();
    } catch (e) {
        // Ignore if attributes can't be fetched
    }

    try {
        // 1. Try to find by userId
        const { data: byId } = await getClient().models.UserProfile.list({
            filter: {
                userId: {
                    eq: user.userId
                }
            }
        });

        if (byId.length > 0) {
            const profile = byId[0];

            // Check if we need to sync profile picture from social login
            if (!profile.profilePictureUrl && userAttributes?.picture) {
                await getClient().models.UserProfile.update({
                    id: profile.id,
                    profilePictureUrl: userAttributes.picture
                });
            }

            const role = profile.role;

            // Check for suspended status
            if (profile.status === 'SUSPENDED') {
                throw new Error('ACCOUNT_SUSPENDED');
            }

            return (role?.toLowerCase() as UserRole) || 'customer';
        }

        // 2. If not found by userId, try by email (to sync manual entries)
        const userEmail = user.signInDetails?.loginId || userAttributes?.email;

        if (userEmail) {
            const { data: byEmail } = await getClient().models.UserProfile.list({
                filter: {
                    email: {
                        eq: userEmail
                    }
                }
            });

            if (byEmail.length > 0) {
                const profile = byEmail[0];

                // Check for suspended status
                if (profile.status === 'SUSPENDED') {
                    throw new Error('ACCOUNT_SUSPENDED');
                }

                // Update the profile with the correct userId and picture if available
                await getClient().models.UserProfile.update({
                    id: profile.id,
                    userId: user.userId,
                    profilePictureUrl: profile.profilePictureUrl || userAttributes?.picture
                });

                const role = profile.role;
                return (role?.toLowerCase() as UserRole) || 'customer';
            }
        }

        return 'customer';
    } catch (error: any) {
        if (error.message === 'ACCOUNT_SUSPENDED') {
            throw error;
        }
        console.error('Error fetching user role:', error);
        return 'customer';
    }
}
