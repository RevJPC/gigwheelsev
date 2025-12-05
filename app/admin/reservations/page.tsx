"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import Link from "next/link";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function AdminReservations() {
    const [reservations, setReservations] = useState<Array<Schema["Reservation"]["type"]>>([]);
    const [vehicles, setVehicles] = useState<Record<string, Schema["Vehicle"]["type"]>>({});
    const [users, setUsers] = useState<Record<string, Schema["UserProfile"]["type"]>>({});
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, revenue: 0 });

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
            const vehicleIds = Array.from(new Set(reservationData.map(r => r.vehicleId)));
            for (const vehicleId of vehicleIds) {
                const { data: vehicle } = await client.models.Vehicle.get({ id: vehicleId });
                if (vehicle) {
                    vehicleMap[vehicleId] = vehicle;
                }
            }
            setVehicles(vehicleMap);

            // Load user profiles
            const userMap: Record<string, Schema["UserProfile"]["type"]> = {};
            const userIds = Array.from(new Set(reservationData.map(r => r.userId)));
            for (const userId of userIds) {
                const { data: profiles } = await client.models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });
                if (profiles.length > 0) {
                    userMap[userId] = profiles[0];
                }
            }
            setUsers(userMap);

            // Calculate stats
            const totalRevenue = reservationData
                .filter(r => r.status === 'COMPLETED')
                .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

            setStats({
                total: reservationData.length,
                pending: reservationData.filter(r => r.status === 'PENDING').length,
                confirmed: reservationData.filter(r => r.status === 'CONFIRMED').length,
                revenue: totalRevenue
            });

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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Management</h1>
                <p className="text-gray-600">View and manage all vehicle reservations</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Reservations</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                        <dd className="mt-1 text-3xl font-semibold text-yellow-600">{stats.pending}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.confirmed}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${stats.revenue.toFixed(2)}</dd>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Reservations Table */}
            {loading ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 mt-4">Loading reservations...</p>
                </div>
            ) : filteredReservations.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-600">No reservations found</p>
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vehicle
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReservations.map((reservation) => {
                                const vehicle = vehicles[reservation.vehicleId];
                                const user = users[reservation.userId];

                                return (
                                    <tr key={reservation.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user?.firstName} {user?.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">{user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {vehicle?.year} {vehicle?.make} {vehicle?.model}
                                            </div>
                                            <div className="text-sm text-gray-500">VIN: {vehicle?.vin.slice(-6)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(reservation.startTime)}</div>
                                            <div className="text-sm text-gray-500">to {formatDate(reservation.endTime)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            ${reservation.totalPrice?.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${getStatusColor(reservation.status || 'PENDING')}`}>
                                                {reservation.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <select
                                                value={reservation.status || 'PENDING'}
                                                onChange={(e) => handleUpdateStatus(reservation.id, e.target.value)}
                                                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="CONFIRMED">Confirmed</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
