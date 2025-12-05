"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import DateRangePicker from "@/components/DateRangePicker";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function VehicleAvailability() {
    const [vehicles, setVehicles] = useState<Array<Schema["Vehicle"]["type"]>>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string>("");
    const [availabilitySlots, setAvailabilitySlots] = useState<Array<Schema["VehicleAvailability"]["type"]>>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isAvailable, setIsAvailable] = useState(true);
    const [reason, setReason] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadVehicles();
    }, []);

    useEffect(() => {
        if (selectedVehicle) {
            loadAvailability();
        }
    }, [selectedVehicle]);

    const loadVehicles = async () => {
        try {
            const { data } = await client.models.Vehicle.list();
            setVehicles(data);
            if (data.length > 0) {
                setSelectedVehicle(data[0].id);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading vehicles:', error);
            setLoading(false);
        }
    };

    const loadAvailability = async () => {
        if (!selectedVehicle) return;

        try {
            const { data } = await client.models.VehicleAvailability.list({
                filter: { vehicleId: { eq: selectedVehicle } }
            });
            setAvailabilitySlots(data.sort((a, b) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            ));
        } catch (error) {
            console.error('Error loading availability:', error);
        }
    };

    const handleAddAvailability = async () => {
        if (!selectedVehicle || !startDate || !endDate) return;

        setSaving(true);
        try {
            await client.models.VehicleAvailability.create({
                vehicleId: selectedVehicle,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                isAvailable: isAvailable,
                reason: reason || undefined,
            });

            setShowAddModal(false);
            setStartDate(null);
            setEndDate(null);
            setReason("");
            setIsAvailable(true);
            loadAvailability();
        } catch (error) {
            console.error('Error adding availability:', error);
            alert('Failed to add availability slot');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSlot = async (slotId: string) => {
        if (!confirm('Are you sure you want to delete this availability slot?')) return;

        try {
            await client.models.VehicleAvailability.delete({ id: slotId });
            loadAvailability();
        } catch (error) {
            console.error('Error deleting slot:', error);
            alert('Failed to delete availability slot');
        }
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Availability Management</h1>
                <p className="text-gray-600">Set availability periods and block times for maintenance</p>
            </div>

            {/* Vehicle Selector */}
            <div className="bg-white shadow rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Vehicle
                </label>
                <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                            {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin.slice(-6)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Add Availability Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Availability Slots</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                >
                    + Add Availability Slot
                </button>
            </div>

            {/* Availability List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-600">Loading...</div>
                ) : availabilitySlots.length === 0 ? (
                    <div className="p-8 text-center text-gray-600">
                        No availability slots defined. Add slots to manage vehicle availability.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Start Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    End Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {availabilitySlots.map((slot) => (
                                <tr key={slot.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDateTime(slot.startTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDateTime(slot.endTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${slot.isAvailable
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {slot.isAvailable ? 'Available' : 'Blocked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {slot.reason || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDeleteSlot(slot.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Availability Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Availability Slot</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {selectedVehicleData?.year} {selectedVehicleData?.make} {selectedVehicleData?.model}
                            </h3>
                        </div>

                        <div className="mb-6">
                            <DateRangePicker
                                onDateChange={(start, end) => {
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!isAvailable}
                                    onChange={(e) => setIsAvailable(!e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Block this time period (vehicle unavailable)
                                </span>
                            </label>
                        </div>

                        {!isAvailable && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for blocking (optional)
                                </label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="e.g., Maintenance, Repair, etc."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setStartDate(null);
                                    setEndDate(null);
                                    setReason("");
                                    setIsAvailable(true);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddAvailability}
                                disabled={!startDate || !endDate || saving}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                            >
                                {saving ? 'Saving...' : 'Add Slot'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
