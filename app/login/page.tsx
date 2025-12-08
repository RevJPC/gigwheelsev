"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { isProfileComplete } from "@/lib/profile-utils";

const getClient = () => generateClient<Schema>();

function RoleBasedRedirect() {
    const router = useRouter();
    const [status, setStatus] = useState("Redirecting to your dashboard...");
    const attemptRef = useRef(0);

    useEffect(() => {
        let mounted = true;

        async function redirect() {
            try {
                await fetchAuthSession();
                const attributes = await fetchUserAttributes();
                const userId = attributes.sub!;

                // Check if UserProfile exists
                const { data: existingProfiles } = await getClient().models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });

                if (existingProfiles.length === 0) {
                    router.push('/signup');
                    return;
                }

                // Check if profile is complete
                const profile = existingProfiles[0];
                if (!isProfileComplete(profile)) {
                    router.push('/signup');
                    return;
                }

                const role = attributes['custom:role'];

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
                attemptRef.current += 1;
                if (attemptRef.current < 3) {
                    setStatus("Retrying...");
                    setTimeout(redirect, 1000);
                } else {
                    setStatus("Unable to load your profile. Redirecting to customer dashboard...");
                    setTimeout(() => {
                        if (mounted) router.push('/customer');
                    }, 1500);
                }
            }
        }

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
