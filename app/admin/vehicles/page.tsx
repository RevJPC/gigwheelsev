"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function VehicleList() {
    const [vehicles, setVehicles] = useState<Array<Schema["Vehicle"]["type"]>>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const sub = client.models.Vehicle.observeQuery().subscribe({
            next: (data) => setVehicles([...data.items]),
        });
        return () => sub.unsubscribe();
    }, []);

    const deleteVehicle = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this vehicle?")) {
            await client.models.Vehicle.delete({ id });
        }
    };

    const syncVehicles = async () => {
        setIsSyncing(true);
        setSyncMessage(null);
        try {
            const response = await client.queries.teslaSync();
            if (response.data) {
                const lambdaResponse = JSON.parse(response.data as string);
                const body = JSON.parse(lambdaResponse.body);
                setSyncMessage({ type: 'success', text: `Sync complete! ${body.details.length} vehicles updated.` });
            }
        } catch (error) {
            setSyncMessage({ type: 'error', text: `Sync failed: ${error}` });
        } finally {
            setIsSyncing(false);
            setTimeout(() => setSyncMessage(null), 5000);
        }
    };

    const formatRelativeTime = (dateString: string | null | undefined) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all vehicles in your fleet including their make, model, VIN, and status.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 flex gap-3">
                    <button
                        onClick={syncVehicles}
                        disabled={isSyncing}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSyncing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Syncing...
                            </>
                        ) : 'Sync Now'}
                    </button>
                    <Link
                        href="/admin/vehicles/add"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Vehicle
                    </Link>
                </div>
            </div>
            {syncMessage && (
                <div className={`mt-4 rounded-md p-4 ${syncMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <p className="text-sm font-medium">{syncMessage.text}</p>
                </div>
            )}
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Vehicle
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Battery & Range
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Firmware
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Last Synced
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Price/Day
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="hover:bg-gray-50">
                                            <td className="py-4 pl-4 pr-3 sm:pl-6">
                                                <div className="flex flex-col">
                                                    <div className="font-medium text-gray-900">
                                                        {vehicle.make} {vehicle.model}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {vehicle.year} • {vehicle.color || 'Unknown Color'} • {vehicle.vin}
                                                        {vehicle.odometer && ` • ${Math.round(vehicle.odometer).toLocaleString()} mi`}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                {vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${vehicle.batteryLevel > 60 ? 'bg-green-500' :
                                                                        vehicle.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                                        }`}
                                                                    style={{ width: `${vehicle.batteryLevel}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {vehicle.batteryLevel}%
                                                            </span>
                                                        </div>
                                                        {vehicle.range && (
                                                            <div className="text-xs text-gray-500">
                                                                {Math.round(vehicle.range)} mi range
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400">No data</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-900">
                                                {vehicle.firmwareVersion || <span className="text-gray-400">Unknown</span>}
                                            </td>
                                            <td className="px-3 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                    vehicle.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                                                        vehicle.status === 'CHARGING' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                    }`}>
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                {formatRelativeTime(vehicle.lastSyncedAt)}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-900">
                                                ${vehicle.pricePerDay}
                                            </td>
                                            <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={`/admin/vehicles/${vehicle.id}/detail`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        href={`/admin/vehicles/${vehicle.id}`}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteVehicle(vehicle.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
