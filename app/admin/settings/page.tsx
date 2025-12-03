"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function SettingsPage() {
    const [isConnected, setIsConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [syncStatus, setSyncStatus] = useState("");

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const { data: integrations } = await client.models.TeslaIntegration.list();
            setIsConnected(integrations.length > 0);
        } catch (error) {
            console.error("Error checking connection:", error);
        }
    };

    const handleConnect = async () => {
        setLoading(true);
        try {
            const response = await client.queries.teslaConnect({
                redirectUri: 'https://gigwheelsev.com/admin/settings/callback'
            });

            const data = typeof response?.data === 'string' ? JSON.parse(response.data) : response?.data;

            if (data && data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                alert("Failed to get Auth URL");
            }
        } catch (error) {
            console.error("Error connecting:", error);
            alert("Failed to initiate connection");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        setSyncStatus("Syncing...");
        try {
            const response = await client.queries.teslaSync();
            console.log("Sync Response:", response);

            const result = typeof response?.data === 'string' ? JSON.parse(response.data) : response?.data;
            console.log("Sync Result:", result);

            // Check if statusCode is 200 (success)
            if (result?.statusCode === 200) {
                const body = typeof result.body === 'string' ? JSON.parse(result.body) : result.body;
                setSyncStatus(`✅ ${body.message || 'Sync complete'}! ${body.details?.length || 0} vehicles updated.`);
            } else if (result?.message) {
                setSyncStatus(`Success: ${result.message}. ${result.details?.join(", ")}`);
            } else {
                setSyncStatus(`Sync failed: ${JSON.stringify(result)}`);
            }
        } catch (error) {
            console.error("Error syncing:", error);
            setSyncStatus("Error syncing vehicles");
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect your Tesla account?")) {
            return;
        }

        setLoading(true);
        try {
            const { data: integrations } = await client.models.TeslaIntegration.list();
            if (integrations.length > 0) {
                await client.models.TeslaIntegration.delete({ id: integrations[0].id });
                setIsConnected(false);
                setSyncStatus("");
            }
        } catch (error) {
            console.error("Error disconnecting:", error);
            alert("Failed to disconnect");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        setSyncStatus("Registering with Tesla Fleet API...");
        try {
            const response = await client.queries.teslaRegister({
                domain: 'https://gigwheelsev.com'
            });

            const result = typeof response?.data === 'string' ? JSON.parse(response.data) : response?.data;
            console.log("Registration result:", result);

            if (result && result.message) {
                setSyncStatus(result.message);
            } else if (result && result.error) {
                setSyncStatus(`Registration failed: ${result.error}. ${result.details || ''}`);
            } else {
                setSyncStatus(`Unexpected response: ${JSON.stringify(result)}`);
            }
        } catch (error) {
            console.error("Error registering:", error);
            setSyncStatus(`Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Tesla Integration</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Connect your Tesla account to sync vehicle data.</p>
                    </div>
                    <div className="mt-5">
                        {isConnected ? (
                            <div className="space-y-4">
                                <div className="flex items-center text-green-600">
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Connected to Tesla Fleet API
                                </div>
                                <div className="flex gap-3 flex-wrap">
                                    <button
                                        type="button"
                                        onClick={handleRegister}
                                        disabled={loading}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {loading ? "Registering..." : "Register Account"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSync}
                                        disabled={loading}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {loading ? "Syncing..." : "Sync Vehicles Now"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDisconnect}
                                        disabled={loading}
                                        className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                                {syncStatus && <p className="text-sm text-gray-600">{syncStatus}</p>}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleConnect}
                                disabled={loading}
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? "Connecting..." : "Connect Tesla Account"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
