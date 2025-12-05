"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

import { Suspense } from "react";

function ConfirmChangesContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const requestId = searchParams.get("id");

    const [loading, setLoading] = useState(true);
    const [changeRequest, setChangeRequest] = useState<Schema["ProfileChangeRequest"]["type"] | null>(null);
    const [userProfile, setUserProfile] = useState<Schema["UserProfile"]["type"] | null>(null);
    const [newData, setNewData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (token && requestId) {
            loadChangeRequest();
        } else {
            setError("Invalid confirmation link");
            setLoading(false);
        }
    }, [token, requestId]);

    const loadChangeRequest = async () => {
        try {
            // Load the change request
            const { data: request } = await client.models.ProfileChangeRequest.get({ id: requestId! });

            if (!request) {
                setError("Change request not found");
                setLoading(false);
                return;
            }

            if (request.token !== token) {
                setError("Invalid token");
                setLoading(false);
                return;
            }

            if (request.status !== 'PENDING') {
                setError(`This request has already been ${request.status.toLowerCase()}`);
                setLoading(false);
                return;
            }

            setChangeRequest(request);
            setNewData(JSON.parse(request.newData as string));

            // Load the current user profile
            const { data: profiles } = await client.models.UserProfile.list({
                filter: { userId: { eq: request.userId } }
            });

            if (profiles.length > 0) {
                setUserProfile(profiles[0]);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error loading change request:", error);
            setError("Failed to load change request");
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!changeRequest || !userProfile) return;

        try {
            // Update the user profile
            await client.models.UserProfile.update({
                id: userProfile.id,
                ...newData
            });

            // Update the change request status
            await client.models.ProfileChangeRequest.update({
                id: changeRequest.id,
                status: 'APPROVED'
            });

            alert("Profile updated successfully!");
            window.location.href = "/";
        } catch (error) {
            console.error("Error confirming changes:", error);
            alert("Failed to update profile");
        }
    };

    const handleReject = async () => {
        if (!changeRequest) return;

        try {
            await client.models.ProfileChangeRequest.update({
                id: changeRequest.id,
                status: 'REJECTED'
            });

            alert("Changes rejected");
            window.location.href = "/";
        } catch (error) {
            console.error("Error rejecting changes:", error);
            alert("Failed to reject changes");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="bg-slate-800 rounded-lg shadow-xl p-8 max-w-md">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
                    <p className="text-slate-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h1 className="text-2xl font-bold text-white">Profile Change Request</h1>
                    <p className="text-slate-400 text-sm">An administrator has requested to update your profile</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-700 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Proposed Changes</h2>
                        <div className="space-y-3">
                            {Object.entries(newData).map(([key, value]) => {
                                const currentValue = userProfile?.[key as keyof typeof userProfile];
                                const hasChanged = currentValue !== value;

                                return (
                                    <div key={key} className={`p-3 rounded ${hasChanged ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-slate-600'}`}>
                                        <div className="text-sm font-medium text-slate-300 capitalize mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-1">
                                                <div className="text-xs text-slate-400">Current</div>
                                                <div className="text-white">{currentValue || <span className="text-slate-500 italic">Not set</span>}</div>
                                            </div>
                                            {hasChanged && (
                                                <>
                                                    <div className="text-yellow-500">→</div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-slate-400">New</div>
                                                        <div className="text-white font-semibold">{value as string}</div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={handleReject}
                            className="px-6 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700"
                        >
                            Reject Changes
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Confirm Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
