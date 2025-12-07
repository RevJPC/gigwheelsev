"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { fetchUserAttributes, fetchAuthSession, updatePassword } from "aws-amplify/auth";
import { uploadData, getUrl } from "aws-amplify/storage";
import RouteGuard from "@/app/components/RouteGuard";
import {
    validatePasswordRequirements,
    checkPasswordStrength,
    getAuthProvider,
    type PasswordStrength
} from "@/lib/password-utils";

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
        dateOfBirth: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
    });
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Password management state
    const [authProvider, setAuthProvider] = useState<'email' | 'google' | 'unknown'>('unknown');
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
    const [passwordError, setPasswordError] = useState<string>('');
    const [passwordSuccess, setPasswordSuccess] = useState<string>('');
    const [changingPassword, setChangingPassword] = useState(false);

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
                        dateOfBirth: userProfile.dateOfBirth || "",
                        emergencyContactName: userProfile.emergencyContactName || "",
                        emergencyContactPhone: userProfile.emergencyContactPhone || "",
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

            // Detect auth provider
            const provider = await getAuthProvider();
            setAuthProvider(provider);
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
                dateOfBirth: formData.dateOfBirth,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
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
                dateOfBirth: formData.dateOfBirth,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone,
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

    // Handle password form changes
    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
        setPasswordError('');
        setPasswordSuccess('');

        // Check strength for new password
        if (field === 'newPassword') {
            if (value) {
                setPasswordStrength(checkPasswordStrength(value));
            } else {
                setPasswordStrength(null);
            }
        }
    };

    // Handle password update
    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        // Validate passwords match
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        // Validate password requirements
        const validation = validatePasswordRequirements(passwordForm.newPassword);
        if (!validation.isValid) {
            setPasswordError(validation.errors.join('. '));
            return;
        }

        setChangingPassword(true);

        try {
            if (authProvider === 'google') {
                // OAuth users cannot directly set a password
                // They need to use the password reset flow
                setPasswordError(
                    'To set a password for your Google account, please use the "Forgot Password" option on the login page. ' +
                    'You will receive a verification code via email to set your password.'
                );
                setChangingPassword(false);
                return;
            } else {
                // Regular user changing password
                if (!passwordForm.currentPassword) {
                    setPasswordError('Current password is required');
                    return;
                }

                await updatePassword({
                    oldPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                });
            }

            setPasswordSuccess('Password updated successfully!');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setPasswordStrength(null);

            // Close the section after a delay
            setTimeout(() => {
                setShowPasswordSection(false);
                setPasswordSuccess('');
            }, 2000);

        } catch (error: any) {
            console.error('Error updating password:', error);

            if (error.name === 'NotAuthorizedException') {
                setPasswordError('Current password is incorrect');
            } else if (error.name === 'InvalidPasswordException') {
                setPasswordError('Password does not meet requirements');
            } else if (error.name === 'LimitExceededException') {
                setPasswordError('Too many attempts. Please try again later');
            } else {
                setPasswordError(error.message || 'Failed to update password');
            }
        } finally {
            setChangingPassword(false);
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

                            {/* Security Section */}
                            <div className="pt-6 border-t border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Security</h3>
                                        <p className="text-sm text-slate-400">
                                            {authProvider === 'google'
                                                ? 'You signed in with Google. You can add password login as an alternative.'
                                                : 'Manage your password and security settings'}
                                        </p>
                                    </div>
                                    {authProvider === 'email' && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswordSection(!showPasswordSection)}
                                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            {showPasswordSection ? 'Cancel' : 'Change Password'}
                                        </button>
                                    )}
                                </div>

                                {authProvider === 'google' && (
                                    <div className="p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-200 mb-2">How to add password login:</h4>
                                        <ol className="text-sm text-blue-100 space-y-2 list-decimal list-inside">
                                            <li>Log out of your account</li>
                                            <li>On the login page, click "Forgot Password"</li>
                                            <li>Enter your email address ({profile?.email})</li>
                                            <li>Check your email for a verification code</li>
                                            <li>Set your new password</li>
                                        </ol>
                                        <p className="text-xs text-blue-200 mt-3">
                                            After setting a password, you'll be able to log in using either Google or email/password.
                                        </p>
                                    </div>
                                )}

                                {showPasswordSection && authProvider === 'email' && (
                                    <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-4 p-4 bg-slate-750 rounded-lg border border-slate-600">
                                        <div>
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-1">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                id="currentPassword"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-1">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                                required
                                            />

                                            {/* Password Strength Indicator */}
                                            {passwordStrength && (
                                                <div className="mt-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-300 ${passwordStrength.level === 'weak' ? 'bg-red-500 w-1/3' :
                                                                    passwordStrength.level === 'medium' ? 'bg-yellow-500 w-2/3' :
                                                                        'bg-green-500 w-full'
                                                                    }`}
                                                            />
                                                        </div>
                                                        <span className={`text-xs font-medium ${passwordStrength.level === 'weak' ? 'text-red-400' :
                                                            passwordStrength.level === 'medium' ? 'text-yellow-400' :
                                                                'text-green-400'
                                                            }`}>
                                                            {passwordStrength.level.charAt(0).toUpperCase() + passwordStrength.level.slice(1)}
                                                        </span>
                                                    </div>
                                                    {passwordStrength.feedback.length > 0 && (
                                                        <ul className="text-xs text-slate-400 space-y-1 mt-1">
                                                            {passwordStrength.feedback.map((item, idx) => (
                                                                <li key={idx}>• {item}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}

                                            {/* Password Requirements */}
                                            <div className="mt-2 text-xs text-slate-400">
                                                <p className="font-medium mb-1">Password must contain:</p>
                                                <ul className="space-y-0.5">
                                                    <li>• At least 8 characters</li>
                                                    <li>• Uppercase and lowercase letters</li>
                                                    <li>• At least one number</li>
                                                    <li>• At least one special character</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-slate-600 bg-slate-700 text-white rounded-md"
                                                required
                                            />
                                        </div>

                                        {passwordError && (
                                            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                                                {passwordError}
                                            </div>
                                        )}

                                        {passwordSuccess && (
                                            <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-200 text-sm">
                                                {passwordSuccess}
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowPasswordSection(false);
                                                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                                    setPasswordError('');
                                                    setPasswordSuccess('');
                                                    setPasswordStrength(null);
                                                }}
                                                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={changingPassword}
                                                className={`flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium ${changingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {changingPassword ? 'Updating...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>
                                )}
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
