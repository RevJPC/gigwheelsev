"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserAttributes } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const navigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Vehicles", href: "/admin/vehicles" },
    { name: "Reservations", href: "/admin/reservations" },
    { name: "Users", href: "/admin/users" },
    { name: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [user, setUser] = useState<{ email: string; picture?: string } | null>(null);

    useEffect(() => {
        async function loadAdminProfile() {
            try {
                const attributes = await fetchUserAttributes();
                const userId = attributes.sub;
                let pictureUrl = null;

                if (userId) {
                    const { data: profiles } = await client.models.UserProfile.list({
                        filter: { userId: { eq: userId } }
                    });
                    if (profiles.length > 0) {
                        const profile = profiles[0];
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
                    picture: pictureUrl || undefined
                });
            } catch (e) {
                console.error("Error loading admin profile", e);
            }
        }
        loadAdminProfile();
    }, []);

    return (
        <div className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">
            <div className="flex flex-col h-32 items-center justify-center border-b border-slate-800 gap-3">
                <h1 className="text-xl font-bold">GigWheels Admin</h1>
                {user && (
                    <div className="flex items-center gap-2">
                        {user.picture ? (
                            <img
                                src={user.picture}
                                alt="Admin"
                                className="w-8 h-8 rounded-full object-cover border border-slate-600"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                                {user.email[0]?.toUpperCase()}
                            </div>
                        )}
                        <span className="text-xs text-slate-400 truncate max-w-[120px]">{user.email}</span>
                    </div>
                )}
            </div>
            <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${isActive
                                ? "bg-slate-800 text-white"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
