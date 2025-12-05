"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Navigation() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            await fetchAuthSession();
            const attributes = await fetchUserAttributes();
            setUser({
                email: attributes.email || '',
                role: attributes['custom:role'] || 'customer'
            });
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setUser(null);
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return null; // Don't show nav while loading
    }

    return (
        <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href={user ? (user.role === 'admin' ? '/admin' : user.role === 'employee' ? '/employee' : '/customer') : '/'} className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                            GigWheels EV
                        </Link>

                        {user && (
                            <div className="ml-10 flex items-baseline space-x-4">
                                {user.role === 'admin' && (
                                    <>
                                        <Link href="/admin" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Dashboard
                                        </Link>
                                        <Link href="/admin/vehicles" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Vehicles
                                        </Link>
                                        <Link href="/admin/users" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Users
                                        </Link>
                                    </>
                                )}
                                {user.role === 'employee' && (
                                    <>
                                        <Link href="/employee" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Dashboard
                                        </Link>
                                        <Link href="/employee/fleet" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Fleet
                                        </Link>
                                    </>
                                )}
                                {user.role === 'customer' && (
                                    <>
                                        <Link href="/customer" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Dashboard
                                        </Link>
                                        <Link href="/customer/vehicles" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Browse Vehicles
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-slate-300 text-sm">
                                    {user.email} <span className="text-slate-500">({user.role})</span>
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/signup" className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
