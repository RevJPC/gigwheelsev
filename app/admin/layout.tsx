import AdminSidebar from "@/components/AdminSidebar";
import RouteGuard from "@/app/components/RouteGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RouteGuard allowedRoles={['admin']}>
            <div className="flex h-screen bg-gray-100">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </RouteGuard>
    );
}
