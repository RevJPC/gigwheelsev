"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/app/lib/auth";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

type UserRole = 'admin' | 'employee' | 'customer';

interface RouteGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const userRole = await getUserRole();

            if (allowedRoles.includes(userRole)) {
                setAuthorized(true);
            } else {
                // Redirect to appropriate dashboard
                if (userRole === 'admin') {
                    router.push('/admin');
                } else if (userRole === 'employee') {
                    router.push('/employee');
                } else {
                    router.push('/customer');
                }
            }
        } catch (error: any) {
            if (error.message === 'ACCOUNT_SUSPENDED') {
                router.push('/suspended');
                return;
            }
            // Not authenticated, redirect to login
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}
