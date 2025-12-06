"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

// Lazy load client to avoid eager configuration issues
const getClient = () => generateClient<Schema>();

function RoleBasedRedirect() {
    const router = useRouter();
    const [status, setStatus] = useState("Redirecting to your dashboard...");
    const attemptRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        async function redirect() {
            try {
                // Ensure we have a session first
                await fetchAuthSession();

                const attributes = await fetchUserAttributes();
                const userId = attributes.sub!;
                const email = attributes.email!;

                console.log("User authenticated:", { userId, email });

                // Check if UserProfile exists
                const { data: existingProfiles } = await getClient().models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });

                if (existingProfiles.length === 0) {
                    console.log("No UserProfile found, creating one for OAuth user...");
                    setStatus("Setting up your profile...");

                    // Extract name from attributes
                    const fullName = attributes.name || email.split('@')[0];
                    const nameParts = fullName.split(' ');
                    const firstName = nameParts[0];
                    const lastName = nameParts.slice(1).join(' ');

                    // Create UserProfile for OAuth user
                    const { data: newProfile, errors: profileErrors } = await getClient().models.UserProfile.create({
                        userId,
                        email,
                        firstName,
                        lastName,
                        role: 'CUSTOMER',
                        status: 'ACTIVE',
                        profilePictureUrl: attributes.picture || null
                    });

                    if (profileErrors) {
                        console.error("Error creating profile:", profileErrors);
                    } else {
                        console.log("✅ UserProfile created for OAuth user:", newProfile);
                    }
                }

                const role = attributes['custom:role'];
                console.log("User role found:", role);

                if (!mounted) return;

                // Route based on role
                if (role === 'admin') {
                    router.push('/admin');
                } else if (role === 'employee') {
                    router.push('/employee');
                } else {
                    router.push('/customer');
                }
            } catch (error) {
                console.error('Error in redirect flow:', error);

                // Retry logic if we just got a session but attributes aren't ready
                if (attemptRef.current < 3) {
                    attemptRef.current += 1;
                    setStatus(`Syncing profile... (Attempt ${attemptRef.current})`);
                    setTimeout(redirect, 1000);
                    return;
                }

                // Fallback
                console.log("Fallback to customer dashboard");
                router.push('/customer');
            }
        }

        // Listen for token refresh or sign in events as well, in case we mounted too early
        const listener = Hub.listen('auth', (data) => {
            if (data.payload.event === 'signInWithRedirect' || data.payload.event === 'signedIn') {
                redirect();
            }
        });

        redirect();

        return () => {
            mounted = false;
            listener();
        };
    }, [router]);

    return (
        <div className="text-center mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className="text-slate-300">{status}</p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                        Sign in to GigWheels EV
                    </h2>
                </div>
                <Authenticator initialState="signIn" socialProviders={['google']}>
                    {({ user }) => (user ? <RoleBasedRedirect /> : <main></main>)}
                </Authenticator>
            </div>
        </div>
    );
}
