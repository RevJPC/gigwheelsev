"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { fetchAuthSession } from "aws-amplify/auth";
import Link from "next/link";
import RouteGuard from "@/app/components/RouteGuard";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function CustomerReservations() {
    const [reservations, setReservations] = useState<Array<Schema["Reservation"]["type"]>>([]);
    const [vehicles, setVehicles] = useState<Record<string, Schema["Vehicle"]["type"]>>({});
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        let subscription: any;

        const setupSubscription = async () => {
            try {
                const session = await fetchAuthSession();
                const currentUserId = session.userSub;

                if (!currentUserId) {
                    console.error("User not authenticated");
                    setLoading(false);
                    return;
                }

                setUserId(currentUserId);
                console.log("Setting up reservation subscription for user:", currentUserId);

                // Use observeQuery for real-time updates
                subscription = client.models.Reservation.observeQuery({
                    filter: { userId: { eq: currentUserId } }
                }).subscribe({
                    next: async ({ items }) => {
                        console.log("Received reservations:", items.length);
                        setReservations([...items]);

                        // Load vehicle details for each reservation
                        const vehicleMap: Record<string, Schema["Vehicle"]["type"]> = {};
                        for (const reservation of items) {
                            if (!vehicleMap[reservation.vehicleId]) {
                                const { data: vehicle } = await client.models.Vehicle.get({ id: reservation.vehicleId });
                                if (vehicle) {
                                    vehicleMap[reservation.vehicleId] = vehicle;
                                }
                            }
                        }
                        setVehicles(vehicleMap);
                        setLoading(false);
                    },
                    error: (error) => {
                        console.error('Error observing reservations:', error);
                        setLoading(false);
                    }
                });
            } catch (error) {
                console.error('Error setting up subscription:', error);
                setLoading(false);
            }
        };

        setupSubscription();

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    const handleCancelReservation = async (reservationId: string) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        try {
            await client.models.Reservation.update({
                id: reservationId,
                status: 'CANCELLED'
            });

            // observeQuery will automatically update the list
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Failed to cancel reservation');
        }
    };

    const filteredReservations = reservations.filter(r => {
        const now = new Date();
        const startDate = new Date(r.startTime);
        const endDate = new Date(r.endTime);

        if (filter === 'all') return true;
        if (filter === 'cancelled') return r.status === 'CANCELLED';
        if (filter === 'upcoming') return startDate > now && r.status !== 'CANCELLED';
        if (filter === 'past') return endDate < now || r.status === 'COMPLETED';
        return true;
    }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-500';
            case 'CONFIRMED': return 'bg-green-500';
            case 'COMPLETED': return 'bg-blue-500';
            case 'CANCELLED': return 'bg-red-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <RouteGuard allowedRoles={['customer']}>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                            My Reservations
                        </h1>
                        <p className="text-slate-300">View and manage your vehicle reservations</p>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex gap-3">
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'upcoming'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            Upcoming
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'past'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            Past
                        </button>
                        <button
                            onClick={() => setFilter('cancelled')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'cancelled'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            Cancelled
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-green-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            All
                        </button>
                    </div>

                    {/* Reservations List */}
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                            <p className="text-slate-400 mt-4">Loading reservations...</p>
                        </div>
                    ) : filteredReservations.length === 0 ? (
                        <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
                            <p className="text-slate-400 mb-4">No reservations found</p>
                            <Link
                                href="/customer/vehicles"
                                className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
                            >
                                Browse Vehicles
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredReservations.map((reservation) => {
                                const vehicle = vehicles[reservation.vehicleId];
                                if (!vehicle) return null;

                                return (
                                    <div
                                        key={reservation.id}
                                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                            {/* Vehicle Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-white">
                                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                                    </h3>
                                                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(reservation.status || 'PENDING')}`}>
                                                        {reservation.status}
                                                    </span>
                                                </div>
                                                <p className="text-slate-400 text-sm mb-3">
                                                    {vehicle.color} • VIN: {vehicle.vin.slice(-6)}
                                                </p>

                                                {/* Dates */}
                                                <div className="grid grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <div className="text-xs text-slate-500 mb-1">Start Date</div>
                                                        <div className="text-sm text-white font-medium">{formatDate(reservation.startTime)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-500 mb-1">End Date</div>
                                                        <div className="text-sm text-white font-medium">{formatDate(reservation.endTime)}</div>
                                                    </div>
                                                </div>

                                                {/* Price */}
                                                <div className="text-2xl font-bold text-green-400">
                                                    ${reservation.totalPrice?.toFixed(2)}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    href={`/customer/vehicles/${vehicle.id}`}
                                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-center transition-colors"
                                                >
                                                    View Vehicle
                                                </Link>
                                                {reservation.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => handleCancelReservation(reservation.id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </RouteGuard>
    );
}
