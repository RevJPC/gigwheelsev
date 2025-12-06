"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

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
                console.error('Error fetching user role:', error);

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
