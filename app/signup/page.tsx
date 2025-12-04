"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fetchUserAttributes, updateUserAttributes } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

function HandleNewUser() {
    const router = useRouter();

    useEffect(() => {
        async function setupNewUser() {
            try {
                const attributes = await fetchUserAttributes();

                // Set default role if not set
                if (!attributes['custom:role']) {
                    await updateUserAttributes({
                        userAttributes: {
                            'custom:role': 'customer'
                        }
                    });
                }

                // Create UserProfile in database
                const userId = attributes.sub!;
                const email = attributes.email!;

                // Check if profile already exists
                const existingProfiles = await client.models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });

                if (existingProfiles.data.length === 0) {
                    await client.models.UserProfile.create({
                        userId,
                        email,
                        name: attributes.name || email.split('@')[0],
                        role: 'CUSTOMER'
                    });
                }

                router.push('/customer');
            } catch (error) {
                console.error('Error setting up new user:', error);
                router.push('/customer');
            }
        }
        setupNewUser();
    }, [router]);

    return <div className="text-center mt-4">Setting up your account...</div>;
}

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                        Join GigWheels EV
                    </h2>
                </div>
                <Authenticator initialState="signUp">
                    {({ user }) => (user ? <HandleNewUser /> : <main></main>)}
                </Authenticator>
            </div>
        </div>
    );
}
