"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// Helper function to get Tesla vehicle image
const getTeslaImage = (model: string, color: string | null | undefined) => {
    const modelCode = model.toLowerCase().includes('3') ? 'm3' :
        model.toLowerCase().includes('y') ? 'my' :
            model.toLowerCase().includes('s') ? 'ms' : 'mx';

    // Use Tesla's configurator-style images or placeholder
    return `https://static-assets.tesla.com/configurator/compositor?&options=$MT3${modelCode === 'm3' ? '22' : modelCode === 'my' ? '24' : '01'},PPSW,W40B,IBB1&view=STUD_3QTR&model=${modelCode}&size=1920&bkba_opt=2&crop=0,0,0,0&`;
};

export default function VehicleBrowse() {
    const [vehicles, setVehicles] = useState<Array<Schema["Vehicle"]["type"]>>([]);
    const [filter, setFilter] = useState<'all' | 'available'>('available');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const sub = client.models.Vehicle.observeQuery().subscribe({
            next: (data) => {
                setVehicles([...data.items]);
                setLoading(false);
            },
        });
        return () => sub.unsubscribe();
    }, []);

    const filteredVehicles = vehicles.filter(v =>
        filter === 'all' || v.status === 'AVAILABLE'
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                        Browse Vehicles
                    </h1>
                    <p className="text-slate-300">Choose your perfect electric vehicle</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-3">
                    <button
                        onClick={() => setFilter('available')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'available'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        Available Now
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        All Vehicles
                    </button>
                </div>

                {/* Vehicle Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        <p className="text-slate-400 mt-4">Loading vehicles...</p>
                    </div>
                ) : filteredVehicles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No vehicles available at this time.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVehicles.map((vehicle) => (
                            <div
                                key={vehicle.id}
                                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20"
                            >
                                {/* Vehicle Image */}
                                <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                                    <img
                                        src={vehicle.imageUrl || getTeslaImage(vehicle.model, vehicle.color)}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to solid color if image fails
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    {/* Status Badge */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-green-500 text-white' :
                                                vehicle.status === 'RENTED' ? 'bg-blue-500 text-white' :
                                                    vehicle.status === 'CHARGING' ? 'bg-yellow-500 text-white' :
                                                        'bg-red-500 text-white'
                                            }`}>
                                            {vehicle.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Vehicle Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-4">
                                        {vehicle.color || 'Color N/A'} • VIN: {vehicle.vin.slice(-6)}
                                    </p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-slate-700/50 rounded-lg p-3">
                                            <div className="text-xs text-slate-400 mb-1">Battery</div>
                                            {vehicle.batteryLevel !== null && vehicle.batteryLevel !== undefined ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-slate-600 rounded-full h-2">
                                                        <div
                                                            className={`h-2 rounded-full ${vehicle.batteryLevel > 60 ? 'bg-green-500' :
                                                                    vehicle.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${vehicle.batteryLevel}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-semibold text-white">{vehicle.batteryLevel}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500">N/A</span>
                                            )}
                                        </div>
                                        <div className="bg-slate-700/50 rounded-lg p-3">
                                            <div className="text-xs text-slate-400 mb-1">Range</div>
                                            <div className="text-sm font-semibold text-white">
                                                {vehicle.range ? `${Math.round(vehicle.range)} mi` : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold text-green-400">
                                                ${vehicle.pricePerDay}
                                            </div>
                                            <div className="text-xs text-slate-400">per day</div>
                                        </div>
                                        <button
                                            disabled={vehicle.status !== 'AVAILABLE'}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                                        >
                                            {vehicle.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                                        </button>
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
