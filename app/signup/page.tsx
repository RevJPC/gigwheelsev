"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserAttributes, updateUserAttributes, fetchAuthSession } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import { uploadData } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";
// Amplify configuration is handled in components/ConfigureAmplify.tsx
// Lazy load client to avoid eager configuration issues
const getClient = () => generateClient<Schema>();

function HandleNewUser() {
    const router = useRouter();
    const [step, setStep] = useState<'loading' | 'upload'>('loading');
    const [userAttrs, setUserAttrs] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    // No profile, show upload screen
                    setStep('upload');
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

    const handleComplete = async (skip: boolean) => {
        if (!userAttrs) return;
        setIsSubmitting(true);

        try {
            const userId = userAttrs.sub!;
            const email = userAttrs.email!;
            let profilePictureUrl = userAttrs.picture || null;

            if (!skip && file) {
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

            // Create Profile
            console.log("Creating UserProfile with data:", { userId, email, firstName, lastName });
            const { data: newProfile, errors: profileErrors } = await getClient().models.UserProfile.create({
                userId,
                email,
                firstName,
                lastName,
                role: 'CUSTOMER',
                profilePictureUrl: profilePictureUrl
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
            setIsSubmitting(false);
        }
    };

    if (step === 'loading') {
        return <div className="text-center mt-4 text-white">Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-slate-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Complete Your Profile</h3>
            <div className="mb-6 text-center">
                <div className="w-32 h-32 mx-auto bg-slate-700 rounded-full overflow-hidden mb-4 flex items-center justify-center border-2 border-slate-600">
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
                    className="inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg cursor-pointer transition-colors"
                >
                    Choose Photo
                </label>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => handleComplete(true)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-transparent hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                    Skip
                </button>
                <button
                    onClick={() => handleComplete(false)}
                    disabled={isSubmitting || !file}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                >
                    {isSubmitting ? 'Saving...' : 'Continue'}
                </button>
            </div>
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
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
