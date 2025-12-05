"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { fetchUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { uploadData, getUrl } from "aws-amplify/storage";
import RouteGuard from "@/app/components/RouteGuard";

const client = generateClient<Schema>();

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Schema["UserProfile"]["type"] | null>(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        licenseNumber: "",
        insurancePolicyNumber: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const attributes = await fetchUserAttributes();
            const userId = attributes.sub;

            if (userId) {
                const { data: profiles } = await client.models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });

                if (profiles.length > 0) {
                    const userProfile = profiles[0];
                    setProfile(userProfile);
                    setFormData({
                        firstName: userProfile.firstName || "",
                        lastName: userProfile.lastName || "",
                        phoneNumber: userProfile.phoneNumber || "",
                        streetAddress: userProfile.streetAddress || "",
                        city: userProfile.city || "",
                        state: userProfile.state || "",
                        zipCode: userProfile.zipCode || "",
                        licenseNumber: userProfile.licenseNumber || "",
                        insurancePolicyNumber: userProfile.insurancePolicyNumber || "",
                    });

                    if (userProfile.profilePictureUrl) {
                        if (userProfile.profilePictureUrl.startsWith('http')) {
                            setPreviewUrl(userProfile.profilePictureUrl);
                        } else {
                            try {
                                const result = await getUrl({ path: userProfile.profilePictureUrl });
                                setPreviewUrl(result.url.toString());
                            } catch (e) {
                                console.error('Error getting profile picture URL:', e);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("=== SAVE BUTTON CLICKED ===", { profile, formData });
        if (!profile) return;

        setSaving(true);
        try {
            let profilePictureUrl = profile.profilePictureUrl;

            if (file) {
                try {
                    // Get the identity ID for the storage path
                    const session = await fetchAuthSession();
                    const identityId = session.identityId;

                    if (!identityId) {
                        throw new Error("No identity ID found");
                    }

                    const result = await uploadData({
                        path: `profile-pictures/${identityId}/profile.jpg`,
                        data: file,
                        options: {
                            contentType: file.type
                        }
                    }).result;
                    profilePictureUrl = result.path;
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    alert("Failed to upload image. Please try again.");
                }
            }

            console.log("Calling update with:", {
                id: profile.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                licenseNumber: formData.licenseNumber,
                insurancePolicyNumber: formData.insurancePolicyNumber,
                profilePictureUrl: profilePictureUrl
            });

            const updateResult = await client.models.UserProfile.update({
                id: profile.id,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                licenseNumber: formData.licenseNumber,
                insurancePolicyNumber: formData.insurancePolicyNumber,
                profilePictureUrl: profilePictureUrl
            });

            console.log("Update result:", updateResult);

            alert("Profile updated successfully!");
            // Reload the profile to show the saved data
            await loadProfile();
        } catch (error: any) {
            console.error("Error updating profile:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <RouteGuard allowedRoles={['admin', 'employee', 'customer']}>
            <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-700">
                        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
                        <p className="text-slate-400 text-sm">Manage your personal information</p>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-slate-400">Loading profile...</div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full object-cover border-4 border-slate-600"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center text-4xl text-slate-400 border-4 border-slate-600">
                                            {profile?.email[0].toUpperCase()}
                                        </div>
                                    )}
                                    <label
                                        htmlFor="file-upload"
                                        className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <p className="text-sm text-slate-400">Click the camera icon to update your photo</p>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                {/* First Name */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300">
                                        First Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300">
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300">
                                        Phone Number
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            id="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Street Address */}
                                <div className="sm:col-span-6">
                                    <label htmlFor="streetAddress" className="block text-sm font-medium text-slate-300">
                                        Street Address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            id="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* City */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-slate-300">
                                        City
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* State */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="state" className="block text-sm font-medium text-slate-300">
                                        State
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="state"
                                            id="state"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Zip Code */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-slate-300">
                                        Zip Code
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="zipCode"
                                            id="zipCode"
                                            value={formData.zipCode}
                                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* License Number */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-slate-300">
                                        Driver's License Number
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="licenseNumber"
                                            id="licenseNumber"
                                            value={formData.licenseNumber}
                                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>

                                {/* Insurance Policy */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-slate-300">
                                        Insurance Policy Number
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="insurancePolicyNumber"
                                            id="insurancePolicyNumber"
                                            value={formData.insurancePolicyNumber}
                                            onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 border-t border-slate-700 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </RouteGuard>
    );
}
