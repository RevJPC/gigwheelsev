"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

const client = generateClient<Schema>();

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<{ email: string; role: string; picture?: string; } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        checkAuth();

        const listener = Hub.listen('auth', (data) => {
            if (data.payload.event === 'signedIn' || data.payload.event === 'signedOut') {
                checkAuth();
                // Close menus on auth change
                setIsMobileMenuOpen(false);
                setIsUserMenuOpen(false);
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

    // Navigation links based on role
    const getNavLinks = () => {
        const publicLinks = [
            { href: '/about', label: 'About' },
            { href: '/reviews', label: 'Reviews' },
        ];

        if (!user) {
            return [
                { href: '/customer/vehicles', label: 'Browse Fleet' },
                ...publicLinks,
            ];
        }

        const roleLinks = {
            admin: [
                { href: '/admin', label: 'Dashboard' },
                { href: '/admin/vehicles', label: 'Vehicles' },
                { href: '/admin/reservations', label: 'Reservations' },
                { href: '/admin/users', label: 'Users' },
            ],
            employee: [
                { href: '/employee', label: 'Dashboard' },
                { href: '/employee/fleet', label: 'Fleet' },
                { href: '/employee/reservations', label: 'Reservations' },
            ],
            customer: [
                { href: '/customer', label: 'Dashboard' },
                { href: '/customer/vehicles', label: 'Browse Fleet' },
                { href: '/customer/reservations', label: 'My Bookings' },
            ]
        };

        if (user.role === 'customer') {
            return [...roleLinks.customer, ...publicLinks];
        }

        return roleLinks[user.role as keyof typeof roleLinks] || roleLinks.customer;
    };

    const links = getNavLinks();

    if (loading) {
        return (
            <nav className="fixed w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="h-8 w-32 bg-slate-800 rounded animate-pulse"></div>
                    <div className="hidden md:flex space-x-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-4 w-20 bg-slate-800 rounded animate-pulse"></div>)}
                    </div>
                    <div className="h-10 w-24 bg-slate-800 rounded animate-pulse"></div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            href={user ? (user.role === 'admin' ? '/admin' : user.role === 'employee' ? '/employee' : '/customer') : '/'}
                            className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 transition-opacity"
                        >
                            GigWheels EV
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-slate-300 hover:text-white transition-colors text-sm font-medium tracking-wide"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu / Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="relative ml-3">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-3 focus:outline-none group"
                                >
                                    <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">
                                        {user.email}
                                    </span>
                                    {user.picture ? (
                                        <img
                                            src={user.picture}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-emerald-500 transition-colors"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-slate-700 group-hover:border-emerald-500 transition-colors">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    )}
                                    <FaChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-4 w-56 rounded-xl shadow-2xl bg-slate-900 ring-1 ring-white/10 py-2 z-50 transform origin-top-right transition-all">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-sm text-white font-medium truncate">{user.email}</p>
                                            <p className="text-xs text-emerald-400 mt-1 capitalize">{user.role}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Account Settings
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleSignOut();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-white/5 hover:text-rose-300 transition-colors"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-slate-300 hover:text-white font-medium transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-full font-medium shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30 hover:translate-y-[-1px]"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-300 hover:text-white p-2"
                        >
                            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-white/10">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {user ? (
                            <div className="pt-4 mt-4 border-t border-white/10">
                                <div className="flex items-center px-3 mb-4">
                                    {user.picture ? (
                                        <img src={user.picture} alt="" className="w-8 h-8 rounded-full border border-slate-600" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{user.email}</p>
                                        <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                                    </div>
                                </div>
                                <Link
                                    href="/settings"
                                    className="block px-3 py-3 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-white/5"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                <Link
                                    href="/login"
                                    className="block text-center px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-white/5"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="block text-center px-4 py-3 rounded-lg text-base font-medium bg-emerald-600 text-white hover:bg-emerald-500"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
