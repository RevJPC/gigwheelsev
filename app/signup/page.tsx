"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserAttributes, updateUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import { uploadData } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";

const getClient = () => generateClient<Schema>();

function HandleNewUser() {
    const router = useRouter();
    const [step, setStep] = useState<'loading' | 'form'>('loading');
    const [userAttrs, setUserAttrs] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        licenseNumber: '',
        insurancePolicyNumber: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactPhone: ''
    });

    useEffect(() => {
        async function checkUser() {
            try {
                const attributes = await fetchUserAttributes();
                setUserAttrs(attributes);
                const userId = attributes.sub!;

                // Check if profile exists
                const existingProfiles = await getClient().models.UserProfile.list({
                    filter: { userId: { eq: userId } }
                });

                if (existingProfiles.data.length > 0) {
                    // Profile exists, redirect
                    const role = existingProfiles.data[0].role;
                    router.push(role === 'ADMIN' ? '/admin' : role === 'EMPLOYEE' ? '/employee' : '/customer');
                } else {
                    // No profile, show form
                    setStep('form');
                }
            } catch (error) {
                console.error("Error checking user:", error);
            }
        }
        checkUser();
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAttrs) return;
        setIsSubmitting(true);

        try {
            const userId = userAttrs.sub!;
            const email = userAttrs.email!;
            let profilePictureUrl = userAttrs.picture || null;

            // Upload profile picture if provided
            if (file) {
                try {
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
                }
            }

            // Derive first and last name
            const fullName = userAttrs.name || email.split('@')[0];
            const nameParts = fullName.split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(' ');

            // Create Profile with all required fields
            console.log("Creating UserProfile with data:", { userId, email, firstName, lastName, ...formData });
            const { data: newProfile, errors: profileErrors } = await getClient().models.UserProfile.create({
                userId,
                email,
                firstName,
                lastName,
                role: 'CUSTOMER',
                status: 'ACTIVE',
                profilePictureUrl: profilePictureUrl,
                phoneNumber: formData.phoneNumber,
                streetAddress: formData.streetAddress,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                licenseNumber: formData.licenseNumber,
                insurancePolicyNumber: formData.insurancePolicyNumber,
                dateOfBirth: formData.dateOfBirth,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone
            });

            if (profileErrors) {
                console.error("Error creating profile:", profileErrors);
                throw new Error("Failed to create user profile");
            }

            console.log("✅ UserProfile created successfully:", newProfile);

            // Set default Cognito role if needed
            if (!userAttrs['custom:role']) {
                await updateUserAttributes({
                    userAttributes: {
                        'custom:role': 'customer'
                    }
                });
            }

            router.push('/customer');

        } catch (error) {
            console.error("Error creating profile:", error);
            alert("Failed to create profile. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (step === 'loading') {
        return <div className="text-center mt-4 text-white">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 bg-slate-800 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h3>
            <p className="text-slate-400 text-sm mb-6">Please provide the following information to complete your registration.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-700">
                    <div className="w-32 h-32 bg-slate-700 rounded-full overflow-hidden flex items-center justify-center border-2 border-slate-600">
                        {preview ? (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl text-slate-500">📷</span>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-upload"
                    />
                    <label
                        htmlFor="profile-upload"
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-colors text-sm"
                    >
                        Choose Photo (Optional)
                    </label>
                </div>

                {/* Contact Information */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="(555) 123-4567"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Address</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Street Address <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.streetAddress}
                                onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="123 Main St"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    City <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    State <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    placeholder="ST"
                                    maxLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    ZIP <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    placeholder="12345"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Driver Information */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Driver Information</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Date of Birth <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Driver's License Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="DL123456"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Insurance Policy Number <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.insurancePolicyNumber}
                                onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="POL123456"
                            />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Contact Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.emergencyContactName}
                                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                                Contact Phone <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.emergencyContactPhone}
                                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                placeholder="(555) 123-4567"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors ${isSubmitting ? 'opacity-50' : ''}`}
                    >
                        {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                        Join GigWheels EV
                    </h2>
                </div>
                <Authenticator initialState="signUp" socialProviders={['google'/*, 'facebook'*/]}>
                    {({ user }) => (user ? <HandleNewUser /> : <main></main>)}
                </Authenticator>
            </div>
        </div>
    );
}
