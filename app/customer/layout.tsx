"use client";

import RouteGuard from "@/app/components/RouteGuard";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
        </>
    );
}
