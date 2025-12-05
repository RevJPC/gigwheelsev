"use client";

import RouteGuard from "@/app/components/RouteGuard";

export default function EmployeeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RouteGuard allowedRoles={['employee', 'admin']}>
            {children}
        </RouteGuard>
    );
}
