"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function AddVehicle() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        licensePlate: "",
        pricePerDay: 0,
        status: "AVAILABLE" as Schema["Vehicle"]["type"]["status"],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.models.Vehicle.create({
                ...formData,
                year: Number(formData.year),
                pricePerDay: Number(formData.pricePerDay),
            });
            router.push("/admin/vehicles");
        } catch (error) {
            console.error("Error adding vehicle:", error);
            alert("Failed to add vehicle. Check console for details.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Vehicle</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                        <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                            Make
                        </label>
                        <input
                            type="text"
                            name="make"
                            id="make"
                            required
                            value={formData.make}
                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                            Model
                        </label>
                        <input
                            type="text"
                            name="model"
                            id="model"
                            required
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                            Year
                        </label>
                        <input
                            type="number"
                            name="year"
                            id="year"
                            required
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="sm:col-span-4">
                        <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                            VIN
                        </label>
                        <input
                            type="text"
                            name="vin"
                            id="vin"
                            required
                            value={formData.vin}
                            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                            License Plate
                        </label>
                        <input
                            type="text"
                            name="licensePlate"
                            id="licensePlate"
                            value={formData.licensePlate}
                            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700">
                            Price Per Day ($)
                        </label>
                        <input
                            type="number"
                            name="pricePerDay"
                            id="pricePerDay"
                            required
                            min="0"
                            step="0.01"
                            value={formData.pricePerDay}
                            onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || ""}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="RENTED">Rented</option>
                            <option value="MAINTENANCE">Maintenance</option>
                            <option value="CHARGING">Charging</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Save Vehicle
                    </button>
                </div>
            </form>
        </div>
    );
}
