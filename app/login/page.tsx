"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

function RoleBasedRedirect() {
    const router = useRouter();
    const [isRedirecting, setIsRedirecting] = useState(true);

    useEffect(() => {
        async function redirect() {
            try {
                const attributes = await fetchUserAttributes();
                const role = attributes['custom:role'];

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
                router.push('/customer'); // Default to customer
            }
        }
        redirect();
    }, [router]);

    return <div className="text-center mt-4">Redirecting to your dashboard...</div>;
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
                <Authenticator initialState="signIn" socialProviders={['google', 'facebook']}>
                    {({ user }) => (user ? <RoleBasedRedirect /> : <main></main>)}
                </Authenticator>
            </div>
        </div>
    );
}
