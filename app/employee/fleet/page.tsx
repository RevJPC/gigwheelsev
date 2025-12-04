"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const getTeslaImage = (model: string, color: string | null | undefined) => {
    const modelCode = model.toLowerCase().includes('3') ? 'm3' :
        model.toLowerCase().includes('y') ? 'my' :
            model.toLowerCase().includes('s') ? 'ms' : 'mx';
    return `https://static-assets.tesla.com/configurator/compositor?&options=$MT3${modelCode === 'm3' ? '22' : modelCode === 'my' ? '24' : '01'},PPSW,W40B,IBB1&view=STUD_3QTR&model=${modelCode}&size=1920&bkba_opt=2&crop=0,0,0,0&`;
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

export default function EmployeeFleet() {
    const [vehicles, setVehicles] = useState<Array<Schema["Vehicle"]["type"]>>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, available: 0, rented: 0, maintenance: 0, charging: 0 });

    useEffect(() => {
        const sub = client.models.Vehicle.observeQuery().subscribe({
            next: (data) => {
                const items = [...data.items];
                setVehicles(items);
                setStats({
                    total: items.length,
                    available: items.filter(v => v.status === 'AVAILABLE').length,
                    rented: items.filter(v => v.status === 'RENTED').length,
                    maintenance: items.filter(v => v.status === 'MAINTENANCE').length,
                    charging: items.filter(v => v.status === 'CHARGING').length,
                });
                setLoading(false);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                        Fleet Overview
                    </h1>
                    <p className="text-slate-300">Real-time status of all vehicles</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-sm text-slate-400">Total Vehicles</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-400">{stats.available}</div>
                        <div className="text-sm text-slate-400">Available</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-400">{stats.rented}</div>
                        <div className="text-sm text-slate-400">Rented</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">{stats.charging}</div>
                        <div className="text-sm text-slate-400">Charging</div>
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-red-400">{stats.maintenance}</div>
                        <div className="text-sm text-slate-400">Maintenance</div>
                    </div>
                </div>

                {/* Vehicle List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        <p className="text-slate-400 mt-4">Loading fleet...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {vehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-green-500 transition-all"
                            >
                                <div className="flex">
                                    {/* Vehicle Image */}
                                    <div className="w-1/3 bg-gradient-to-br from-slate-700 to-slate-800 relative">
                                        <img
                                            src={vehicle.imageUrl || getTeslaImage(vehicle.model, vehicle.color)}
                                            alt={`${vehicle.make} ${vehicle.model}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.currentTarget.style.display = 'none'}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-green-500 text-white' :
                                                    vehicle.status === 'RENTED' ? 'bg-blue-500 text-white' :
                                                        vehicle.status === 'CHARGING' ? 'bg-yellow-500 text-white' :
                                                            'bg-red-500 text-white'
                                                }`}>
                                                {vehicle.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="flex-1 p-4">
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                        </h3>
                                        <p className="text-xs text-slate-400 mb-3">
                                            {vehicle.color || 'N/A'} • VIN: {vehicle.vin.slice(-6)}
                                        </p>

                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            {/* Battery */}
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1">Battery</div>
                                                {vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined ? (
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex-1 bg-slate-600 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full ${vehicle.batteryLevel > 60 ? 'bg-green-500' :
                                                                        vehicle.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${vehicle.batteryLevel}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold text-white">{vehicle.batteryLevel}%</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-500">N/A</span>
                                                )}
                                            </div>

                                            {/* Range */}
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1">Range</div>
                                                <div className="text-xs font-semibold text-white">
                                                    {vehicle.range ? `${Math.round(vehicle.range)} mi` : 'N/A'}
                                                </div>
                                            </div>

                                            {/* Firmware */}
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1">Firmware</div>
                                                <div className="text-xs font-semibold text-white">
                                                    {vehicle.firmwareVersion || 'N/A'}
                                                </div>
                                            </div>

                                            {/* Last Synced */}
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1">Last Synced</div>
                                                <div className="text-xs font-semibold text-white">
                                                    {formatRelativeTime(vehicle.lastSyncedAt)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex gap-2">
                                            <button className="flex-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors">
                                                View Details
                                            </button>
                                            <button className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded-lg transition-colors">
                                                Maintenance
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
