import type { Schema } from "@/amplify/data/resource";

/**
 * Check if a user profile has all required fields completed
 */
export function isProfileComplete(profile: Schema["UserProfile"]["type"]): boolean {
    return !!(
        profile.phoneNumber &&
        profile.streetAddress &&
        profile.city &&
        profile.state &&
        profile.zipCode &&
        profile.licenseNumber &&
        profile.insurancePolicyNumber &&
        profile.dateOfBirth &&
        profile.emergencyContactName &&
        profile.emergencyContactPhone
    );
}

/**
 * Get list of missing required fields from a profile
 */
export function getMissingProfileFields(profile: Schema["UserProfile"]["type"]): string[] {
    const missing: string[] = [];

    if (!profile.phoneNumber) missing.push('Phone Number');
    if (!profile.streetAddress) missing.push('Street Address');
    if (!profile.city) missing.push('City');
    if (!profile.state) missing.push('State');
    if (!profile.zipCode) missing.push('ZIP Code');
    if (!profile.licenseNumber) missing.push("Driver's License");
    if (!profile.insurancePolicyNumber) missing.push('Insurance Policy');
    if (!profile.dateOfBirth) missing.push('Date of Birth');
    if (!profile.emergencyContactName) missing.push('Emergency Contact Name');
    if (!profile.emergencyContactPhone) missing.push('Emergency Contact Phone');

    return missing;
}
