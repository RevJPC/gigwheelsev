"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RedirectToCustomer() {
    const router = useRouter();
    useEffect(() => {
        router.push('/customer');
    }, [router]);
    return <div className="text-center mt-4">Redirecting...</div>;
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <Authenticator initialState="signIn">
                    {({ user }) => (user ? <RedirectToCustomer /> : <main></main>)}
                </Authenticator>
            </div>
        </div>
    );
}
