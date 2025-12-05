"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function SuspendedPage() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
            <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-lg border border-red-900/50">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-900/30 mb-4">
                        <span className="text-3xl">🚫</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Account Suspended</h2>
                    <p className="text-slate-400 mb-8">
                        Your account has been suspended by an administrator. You cannot access the platform at this time.
                    </p>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">
                            If you believe this is a mistake, please contact support.
                        </p>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
