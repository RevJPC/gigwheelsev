import { Suspense } from "react";
import ConfirmChangesContent from "./ConfirmContent";

export default function ConfirmChangesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        }>
            <ConfirmChangesContent />
        </Suspense>
    );
}
