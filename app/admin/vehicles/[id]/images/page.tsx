"use client";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import { useParams, useRouter } from "next/navigation";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function VehicleImages() {
    const params = useParams();
    const router = useRouter();
    const vehicleId = params.id as string;

    const [vehicle, setVehicle] = useState<Schema["Vehicle"]["type"] | null>(null);
    const [images, setImages] = useState<Array<Schema["VehicleImage"]["type"]>>([]);
    const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicleAndImages();
    }, [vehicleId]);

    const loadVehicleAndImages = async () => {
        try {
            // Load vehicle
            const vehicleResponse = await client.models.Vehicle.get({ id: vehicleId });
            setVehicle(vehicleResponse.data);

            // Load images
            const imagesResponse = await client.models.VehicleImage.list({
                filter: { vehicleId: { eq: vehicleId } }
            });
            const sortedImages = imagesResponse.data.sort((a, b) => (a.order || 0) - (b.order || 0));
            setImages(sortedImages);

            // Fetch URLs for all images
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Upload to S3
            const key = `public/vehicle-images/${vehicleId}/${Date.now()}-${file.name}`;
            const result = await uploadData({
                key,
                data: file,
                options: {
                    contentType: file.type
                }
            }).result;

            // Store the S3 key (not the URL)
            await client.models.VehicleImage.create({
                vehicleId,
                imageUrl: key, // Store the key
                isPrimary: images.length === 0, // First image is primary
                order: images.length
            });

            // Reload images
            await loadVehicleAndImages();
            setUploading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
            setUploading(false);
        }
    };

    const getImageUrl = async (key: string) => {
        try {
            const result = await getUrl({ key });
            return result.url.toString();
        } catch (error) {
            console.error('Error getting image URL:', error);
            return '';
        }
    };

    const setPrimaryImage = async (imageId: string) => {
        try {
            // Set all to non-primary
            await Promise.all(images.map(img =>
                client.models.VehicleImage.update({
                    id: img.id,
                    isPrimary: false
                })
            ));

            // Set selected as primary
            await client.models.VehicleImage.update({
                id: imageId,
                isPrimary: true
            });

            await loadVehicleAndImages();
        } catch (error) {
            console.error('Error setting primary image:', error);
        }
    };

    const deleteImage = async (imageId: string, imageUrl: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            // Delete from S3
            const key = imageUrl.split('/').slice(-3).join('/'); // Extract key from URL
            await remove({ key });

            // Delete from database
            await client.models.VehicleImage.delete({ id: imageId });

            await loadVehicleAndImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Vehicle Images</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {vehicle?.year} {vehicle?.make} {vehicle?.model} ({vehicle?.vin})
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Back to Vehicle
                </button>
            </div>

            {/* Upload Section */}
            <div className="mb-8 bg-white shadow sm:rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Image</h2>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                    <div key={image.id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                            <img
                                src={imageUrls[image.id] || ''}
                                alt={image.caption || 'Vehicle image'}
                                className="w-full h-full object-cover"
                            />
                            {image.isPrimary && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Primary
                                </div>
                            )}
                        </div>
                        <div className="p-4">
                            <div className="flex gap-2">
                                {!image.isPrimary && (
                                    <button
                                        onClick={() => setPrimaryImage(image.id)}
                                        className="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md"
                                    >
                                        Set as Primary
                                    </button>
                                )}
                                <button
                                    onClick={() => deleteImage(image.id, image.imageUrl)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {images.length === 0 && (
                <div className="text-center py-12 bg-white shadow rounded-lg">
                    <p className="text-gray-500">No images uploaded yet. Upload your first image above!</p>
                </div>
            )}
        </div>
    );
}
