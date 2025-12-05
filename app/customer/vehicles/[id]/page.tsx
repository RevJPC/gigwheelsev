"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { getUrl } from "aws-amplify/storage";
import { useParams, useRouter } from "next/navigation";
import { fetchAuthSession } from "aws-amplify/auth";
import DateRangePicker from "@/components/DateRangePicker";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function VehicleDetail() {
    const params = useParams();
    const router = useRouter();
    const vehicleId = params.id as string;

    const [vehicle, setVehicle] = useState<Schema["Vehicle"]["type"] | null>(null);
    const [images, setImages] = useState<Array<Schema["VehicleImage"]["type"]>>([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    const [availabilitySlots, setAvailabilitySlots] = useState<Array<Schema["VehicleAvailability"]["type"]>>([]);

    useEffect(() => {
        loadVehicleData();
    }, [vehicleId]);

    const loadVehicleData = async () => {
        try {
            // Load vehicle
            const vehicleResponse = await client.models.Vehicle.get({ id: vehicleId });
            setVehicle(vehicleResponse.data);

            // Load availability slots
            const availabilityResponse = await client.models.VehicleAvailability.list({
                filter: { vehicleId: { eq: vehicleId } }
            });
            setAvailabilitySlots(availabilityResponse.data);

            // Load images
            const imagesResponse = await client.models.VehicleImage.list({
                filter: { vehicleId: { eq: vehicleId } }
            });
            const sortedImages = imagesResponse.data.sort((a, b) => {
                // Primary first, then by order
                if (a.isPrimary) return -1;
                if (b.isPrimary) return 1;
                return (a.order || 0) - (b.order || 0);
            });
            setImages(sortedImages);

            // Fetch URLs
            const urls: Record<string, string> = {};
            for (const img of sortedImages) {
                try {
                    const result = await getUrl({ key: img.imageUrl });
                    urls[img.id] = result.url.toString();
                } catch (error) {
                    console.error(`Error getting URL for ${img.id}:`, error);
                }
            }
            setImageUrls(urls);
            setLoading(false);
        } catch (error) {
            console.error('Error loading vehicle:', error);
            setLoading(false);
        }
    };

    const checkAvailability = (start: Date, end: Date): boolean => {
        // Check against blocked slots
        for (const slot of availabilitySlots) {
            if (!slot.isAvailable) {
                const slotStart = new Date(slot.startTime);
                const slotEnd = new Date(slot.endTime);

                // Check for overlap
                if (
                    (start < slotEnd && end > slotStart)
                ) {
                    setBookingError(`Vehicle is unavailable from ${slotStart.toLocaleString()} to ${slotEnd.toLocaleString()}`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleBooking = async () => {
        if (!vehicle || !startDate || !endDate) return;

        setBookingLoading(true);
        setBookingError(null);

        if (!checkAvailability(startDate, endDate)) {
            setBookingLoading(false);
            return;
        }

        try {
            // Get current user
            const session = await fetchAuthSession();
            const userId = session.userSub;

            if (!userId) {
                router.push('/login');
                return;
            }

            // Calculate total price (hours * pricePerDay / 24)
            const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
            const days = hours / 24;
            const totalPrice = days * (vehicle.pricePerDay || 0);

            console.log("Creating reservation with:", {
                vehicleId: vehicle.id,
                userId: userId,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                status: 'PENDING',
                totalPrice: totalPrice,
            });

            // Create reservation
            const result = await client.models.Reservation.create({
                vehicleId: vehicle.id,
                userId: userId,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                status: 'PENDING',
                totalPrice: totalPrice,
            });

            console.log("Reservation created successfully:", result);

            setBookingSuccess(true);
            setShowBookingModal(false);

            // Reset form after 2 seconds
            setTimeout(() => {
                setBookingSuccess(false);
                setStartDate(null);
                setEndDate(null);
            }, 3000);
        } catch (error: any) {
            console.error('Error creating reservation:', error);
            setBookingError(error.message || 'Failed to create reservation');
        } finally {
            setBookingLoading(false);
        }
    };

    const calculateTotalPrice = (): number => {
        if (!vehicle || !startDate || !endDate) return 0;
        const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const days = hours / 24;
        return days * (vehicle.pricePerDay || 0);
    };

    const calculateDays = (): string => {
        if (!startDate || !endDate) return "0";
        const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        const days = Math.floor(hours / 24);
        const remainingHours = Math.round(hours % 24);

        if (days > 0 && remainingHours > 0) {
            return `${days}d ${remainingHours}h`;
        } else if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''}`;
        } else {
            return `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white">Vehicle not found</div>
            </div>
        );
    }

    const currentImageUrl = images.length > 0 ? imageUrls[images[currentImageIndex]?.id] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-slate-300 hover:text-white flex items-center gap-2"
                >
                    ← Back to Vehicles
                </button>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Image Gallery */}
                    <div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
                            {/* Main Image */}
                            <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800">
                                {currentImageUrl ? (
                                    <img
                                        src={currentImageUrl}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                                        No image available
                                    </div>
                                )}

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                                        >
                                            ←
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                                        >
                                            →
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Strip */}
                            {images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {images.map((img, idx) => (
                                        <button
                                            key={img.id}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${idx === currentImageIndex ? 'border-green-500' : 'border-transparent'
                                                }`}
                                        >
                                            <img
                                                src={imageUrls[img.id]}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Vehicle Info */}
                    <div>
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h1>
                            <p className="text-slate-400 mb-6">
                                {vehicle.color || 'Color N/A'} • VIN: {vehicle.vin.slice(-6)}
                            </p>

                            {/* Status Badge */}
                            <div className="mb-6">
                                <span className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${vehicle.status === 'AVAILABLE' ? 'bg-green-500 text-white' :
                                    vehicle.status === 'RENTED' ? 'bg-blue-500 text-white' :
                                        vehicle.status === 'CHARGING' ? 'bg-yellow-500 text-white' :
                                            'bg-red-500 text-white'
                                    }`}>
                                    {vehicle.status}
                                </span>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-700/50 rounded-lg p-4">
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
                                            <span className="text-lg font-semibold text-white">{vehicle.batteryLevel}%</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-500">N/A</span>
                                    )}
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Range</div>
                                    <div className="text-lg font-semibold text-white">
                                        {vehicle.range ? `${Math.round(vehicle.range)} mi` : 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Odometer</div>
                                    <div className="text-lg font-semibold text-white">
                                        {vehicle.odometer ? `${Math.round(vehicle.odometer).toLocaleString()} mi` : 'N/A'}
                                    </div>
                                </div>

                                <div className="bg-slate-700/50 rounded-lg p-4">
                                    <div className="text-xs text-slate-400 mb-1">Firmware</div>
                                    <div className="text-sm font-semibold text-white">
                                        {vehicle.firmwareVersion || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Price & Book Button */}
                            <div className="border-t border-slate-700 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-3xl font-bold text-green-400">
                                            ${vehicle.pricePerDay}
                                        </div>
                                        <div className="text-sm text-slate-400">per day</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowBookingModal(true)}
                                    disabled={vehicle.status !== 'AVAILABLE'}
                                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg transition-colors"
                                >
                                    {vehicle.status === 'AVAILABLE' ? 'Book Now' : 'Unavailable'}
                                </button>

                                {/* Success Message */}
                                {bookingSuccess && (
                                    <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-center">
                                        ✓ Reservation created successfully!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Modal */}
                {showBookingModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6">Book Your Reservation</h2>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {vehicle?.year} {vehicle?.make} {vehicle?.model}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    ${vehicle?.pricePerDay} per day
                                </p>
                            </div>

                            <DateRangePicker
                                onDateChange={(start, end) => {
                                    setStartDate(start);
                                    setEndDate(end);
                                }}
                                blockedIntervals={availabilitySlots
                                    .filter(slot => !slot.isAvailable)
                                    .map(slot => ({
                                        start: new Date(slot.startTime),
                                        end: new Date(slot.endTime)
                                    }))}
                            />

                            {startDate && endDate && (
                                <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Duration:</span>
                                        <span className="text-white font-semibold">{calculateDays()} days</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-slate-300">Total Price:</span>
                                        <span className="text-green-400">${calculateTotalPrice().toFixed(2)}</span>
                                    </div>
                                </div>
                            )}

                            {bookingError && (
                                <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
                                    {bookingError}
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowBookingModal(false);
                                        setBookingError(null);
                                        setStartDate(null);
                                        setEndDate(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
                                    disabled={bookingLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBooking}
                                    disabled={!startDate || !endDate || bookingLoading}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                                >
                                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
