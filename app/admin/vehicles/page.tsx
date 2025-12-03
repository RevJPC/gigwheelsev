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

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Vehicles</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all vehicles in your fleet including their make, model, VIN, and status.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href="/admin/vehicles/add"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add Vehicle
                    </Link>
                </div>
            </div>
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
                                            Status
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
                                                        {vehicle.year} • {vehicle.vin}
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
                                            <td className="px-3 py-4">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                                                        vehicle.status === 'RENTED' ? 'bg-blue-100 text-blue-800' :
                                                            vehicle.status === 'CHARGING' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {vehicle.status}
                                                </span>
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
