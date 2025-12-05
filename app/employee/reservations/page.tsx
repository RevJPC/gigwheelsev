"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function EmployeeReservations() {
    const [reservations, setReservations] = useState<Array<Schema["Reservation"]["type"]>>([]);
    const [vehicles, setVehicles] = useState<Record<string, Schema["Vehicle"]["type"]>>({});
    const [users, setUsers] = useState<Record<string, Schema["UserProfile"]["type"]>>({});
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllReservations();
    }, []);

    const loadAllReservations = async () => {
        try {
            // Load all reservations
            const { data: reservationData } = await client.models.Reservation.list();
            setReservations(reservationData);

            // Load vehicle details
            const vehicleMap: Record<string, Schema["Vehicle"]["type"]> = {};
            const vehicleIds = [...new Set(reservationData.map(r => r.vehicleId))];
            for (const vehicleId of vehicleIds) {
                const { data: vehicle } = await client.models.Vehicle.get({ id: vehicleId });
                if (vehicle) {
                    vehicleMap[vehicleId] = vehicle;
                }
            }
            setVehicles(vehicleMap);

            // Load user profiles
            const userMap: Record<string, Schema["UserProfile"]["type"]> = {};
            const userIds = [...new Set(reservationData.map(r => r.userId))];
            for (const userId of userIds) {
                const { data: profiles } = await client.models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });
                if (profiles.length > 0) {
                    userMap[userId] = profiles[0];
                }
            }
            setUsers(userMap);

            setLoading(false);
        } catch (error) {
            console.error('Error loading reservations:', error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (reservationId: string, newStatus: string) => {
        try {
            await client.models.Reservation.update({
                id: reservationId,
                status: newStatus as any
            });

            // Reload reservations
            loadAllReservations();
        } catch (error) {
            console.error('Error updating reservation:', error);
            alert('Failed to update reservation status');
        }
    };

    const filteredReservations = reservations
        .filter(r => filter === 'all' || r.status?.toLowerCase() === filter)
        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
                        Reservation Management
                    </h1>
                    <p className="text-slate-300">View and manage all vehicle reservations</p>
                </div>

                {/* Filters */}
                <div className="mb-6 flex gap-3">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Reservations List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        <p className="text-slate-400 mt-4">Loading reservations...</p>
                    </div>
                ) : filteredReservations.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl">
                        <p className="text-slate-400">No reservations found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReservations.map((reservation) => {
                            const vehicle = vehicles[reservation.vehicleId];
                            const user = users[reservation.userId];

                            return (
                                <div
                                    key={reservation.id}
                                    className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-green-500/50 transition-all"
                                >
                                    <div className="grid md:grid-cols-4 gap-4">
                                        {/* Customer Info */}
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Customer</div>
                                            <div className="text-sm font-semibold text-white">
                                                {user?.firstName} {user?.lastName}
                                            </div>
                                            <div className="text-xs text-slate-400">{user?.email}</div>
                                        </div>

                                        {/* Vehicle Info */}
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Vehicle</div>
                                            <div className="text-sm font-semibold text-white">
                                                {vehicle?.year} {vehicle?.make} {vehicle?.model}
                                            </div>
                                            <div className="text-xs text-slate-400">VIN: {vehicle?.vin.slice(-6)}</div>
                                        </div>

                                        {/* Dates */}
                                        <div>
                                            <div className="text-xs text-slate-500 mb-1">Rental Period</div>
                                            <div className="text-sm text-white">{formatDate(reservation.startTime)}</div>
                                            <div className="text-xs text-slate-400">to {formatDate(reservation.endTime)}</div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                <div className="text-xs text-slate-500 mb-1">Status</div>
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(reservation.status || 'PENDING')}`}>
                                                    {reservation.status}
                                                </span>
                                            </div>
                                            <select
                                                value={reservation.status || 'PENDING'}
                                                onChange={(e) => handleUpdateStatus(reservation.id, e.target.value)}
                                                className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mt-4 pt-4 border-t border-slate-700">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400">Total Price:</span>
                                            <span className="text-2xl font-bold text-green-400">
                                                ${reservation.totalPrice?.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
