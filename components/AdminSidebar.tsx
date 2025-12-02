"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Dashboard", href: "/admin" },
    { name: "Vehicles", href: "/admin/vehicles" },
    { name: "Reservations", href: "/admin/reservations" },
    { name: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center justify-center border-b border-slate-800">
                <h1 className="text-xl font-bold">GigWheels Admin</h1>
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
