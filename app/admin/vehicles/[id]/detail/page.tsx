"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [vehicle, setVehicle] = useState<Schema["Vehicle"]["type"] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVehicle() {
            try {
                const { data } = await client.models.Vehicle.get({ id });
                setVehicle(data);
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchVehicle();
    }, [id]);

    if (loading) return <div className="p-8">Loading...</div>;
    if (!vehicle) return <div className="p-8">Vehicle not found</div>;

    const batteryColor = vehicle.batteryLevel && vehicle.batteryLevel > 60 ? 'text-green-600' :
        vehicle.batteryLevel && vehicle.batteryLevel > 30 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">VIN: {vehicle.vin}</p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={`/admin/vehicles/${vehicle.id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Edit Vehicle
                        </Link>
                        <Link
                            href="/admin/vehicles"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Back to List
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Battery & Range Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Battery & Range</h2>
                    {vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined ? (
                        <div className="space-y-4">
                            {/* Circular Battery Indicator */}
                            <div className="flex items-center justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="#e5e7eb"
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke={vehicle.batteryLevel > 60 ? '#10b981' : vehicle.batteryLevel > 30 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - vehicle.batteryLevel / 100)}`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className={`text-4xl font-bold ${batteryColor}`}>
                                                {vehicle.batteryLevel}%
                                            </div>
                                            <div className="text-sm text-gray-500">Battery</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Range Info */}
                            {vehicle.range && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Estimated Range</span>
                                        <span className="text-2xl font-semibold text-gray-900">
                                            {Math.round(vehicle.range)} mi
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No battery data available
                        </div>
                    )}
                </div>

                {/* Status & Pricing Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Status & Pricing</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b">
                            <span className="text-sm font-medium text-gray-500">Status</span>
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                vehicle.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                                    vehicle.status === 'CHARGING' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                }`}>
                                {vehicle.status}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b">
                            <span className="text-sm font-medium text-gray-500">Price per Day</span>
                            <span className="text-2xl font-bold text-gray-900">${vehicle.pricePerDay}</span>
                        </div>
                        {vehicle.licensePlate && (
                            <div className="flex items-center justify-between py-3">
                                <span className="text-sm font-medium text-gray-500">License Plate</span>
                                <span className="text-lg font-mono text-gray-900">{vehicle.licensePlate}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Location Card */}
                {(vehicle.locationLat && vehicle.locationLng) ? (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
                        <div className="space-y-3">
                            <div className="bg-gray-100 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Coordinates</div>
                                <div className="font-mono text-sm text-gray-900">
                                    {vehicle.locationLat.toFixed(6)}, {vehicle.locationLng.toFixed(6)}
                                </div>
                            </div>
                            <a
                                href={`https://www.google.com/maps?q=${vehicle.locationLat},${vehicle.locationLng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
                        <div className="text-center py-12 text-gray-400">
                            No location data available
                        </div>
                    </div>
                )}

                {/* Vehicle Info Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h2>
                    <dl className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-sm font-medium text-gray-500">Make</dt>
                            <dd className="text-sm text-gray-900">{vehicle.make}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-sm font-medium text-gray-500">Model</dt>
                            <dd className="text-sm text-gray-900">{vehicle.model}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-sm font-medium text-gray-500">Year</dt>
                            <dd className="text-sm text-gray-900">{vehicle.year}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <dt className="text-sm font-medium text-gray-500">Color</dt>
                            <dd className="text-sm text-gray-900">{vehicle.color || 'N/A'}</dd>
                        </div>
                        <div className="flex justify-between py-2">
                            <dt className="text-sm font-medium text-gray-500">VIN</dt>
                            <dd className="text-sm font-mono text-gray-900">{vehicle.vin}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
