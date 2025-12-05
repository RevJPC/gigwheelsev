"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; role: string; picture?: string; isMenuOpen?: boolean } | null>(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        checkAuth();

        const listener = Hub.listen('auth', (data) => {
            if (data.payload.event === 'signedIn' || data.payload.event === 'signedOut') {
                checkAuth();
            }
        });

        return () => listener();
    }, []);

    const checkAuth = async () => {
        try {
            await fetchAuthSession();
            const attributes = await fetchUserAttributes();
            const userId = attributes.sub;
            let pictureUrl = null;
            let dbRole = null;

            if (userId) {
                const { data: profiles } = await client.models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });
                if (profiles.length > 0) {
                    const profile = profiles[0];
                    if (profile.role) {
                        dbRole = profile.role.toLowerCase();
                    }
                    if (profile.profilePictureUrl) {
                        if (profile.profilePictureUrl.startsWith('http')) {
                            pictureUrl = profile.profilePictureUrl;
                        } else {
                            try {
                                const result = await getUrl({ path: profile.profilePictureUrl });
                                pictureUrl = result.url.toString();
                            } catch (e) {
                                console.error('Error getting profile picture URL:', e);
                            }
                        }
                    }
                }
            }

            setUser({
                email: attributes.email || '',
                role: dbRole || attributes['custom:role'] || 'customer',
                picture: pictureUrl || undefined
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
                        <Link
                            href={user ? (user.role === 'admin' ? '/admin' : user.role === 'employee' ? '/employee' : '/customer') : '/'}
                            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500"
                        >
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
                                        <Link href="/admin/vehicles/availability" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Availability
                                        </Link>
                                        <Link href="/admin/reservations" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Reservations
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
                                        <Link href="/employee/reservations" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Reservations
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
                                        <Link href="/customer/reservations" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            My Reservations
                                        </Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center">
                        {user ? (
                            <div className="relative ml-3">
                                <button
                                    onClick={() => setUser((prev) => prev ? { ...prev, isMenuOpen: !prev.isMenuOpen } : null)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    {user.picture ? (
                                        <img
                                            src={user.picture}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover border border-slate-600"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-slate-300 text-sm hidden md:block">
                                        {user.email}
                                    </span>
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {user.isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 py-1 z-50 border border-slate-700">
                                        <div className="px-4 py-2 border-b border-slate-700">
                                            <p className="text-sm text-white truncate">{user.email}</p>
                                            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                                        </div>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                            onClick={() => setUser((prev) => prev ? { ...prev, isMenuOpen: false } : null)}
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setUser((prev) => prev ? { ...prev, isMenuOpen: false } : null);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/customer/vehicles" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                    Browse Vehicles
                                </Link>
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
