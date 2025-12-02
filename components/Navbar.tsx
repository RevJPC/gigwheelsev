"use client";

import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.push('/');
    }

    return (
        <nav className="bg-slate-900 border-b border-slate-800 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold text-white">
                    GigWheels EV
                </Link>
                <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    );
}
