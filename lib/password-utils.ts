import { fetchUserAttributes } from 'aws-amplify/auth';

export interface PasswordStrength {
    level: 'weak' | 'medium' | 'strong';
    score: number; // 0-100
    feedback: string[];
}

export interface PasswordValidation {
    isValid: boolean;
    errors: string[];
}

/**
 * Validates password against Cognito requirements
 * Requirements: min 8 chars, uppercase, lowercase, numbers, symbols
 */
export function validatePasswordRequirements(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Checks password strength and provides feedback
 */
export function checkPasswordStrength(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    // Length scoring
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Character variety
    if (/[a-z]/.test(password)) score += 10;
    if (/[A-Z]/.test(password)) score += 10;
    if (/[0-9]/.test(password)) score += 10;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    // Multiple special characters
    const specialChars = password.match(/[^a-zA-Z0-9]/g);
    if (specialChars && specialChars.length > 1) score += 10;

    // Mix of character types
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (varietyCount === 4) score += 15;

    // Feedback
    if (password.length < 12) {
        feedback.push('Consider using a longer password (12+ characters)');
    }

    if (!hasSpecial) {
        feedback.push('Add special characters for better security');
    }

    if (varietyCount < 4) {
        feedback.push('Use a mix of uppercase, lowercase, numbers, and symbols');
    }

    // Common patterns (weak)
    const commonPatterns = [
        /^[a-z]+$/i, // all letters
        /^[0-9]+$/, // all numbers
        /(.)\1{2,}/, // repeated characters
        /^(password|qwerty|123456|abc123)/i // common passwords
    ];

    for (const pattern of commonPatterns) {
        if (pattern.test(password)) {
            score = Math.max(0, score - 20);
            feedback.push('Avoid common patterns and repeated characters');
            break;
        }
    }

    // Determine level
    let level: 'weak' | 'medium' | 'strong';
    if (score < 40) {
        level = 'weak';
    } else if (score < 70) {
        level = 'medium';
    } else {
        level = 'strong';
    }

    return {
        level,
        score: Math.min(100, score),
        feedback
    };
}

/**
 * Detects if the current user has a password set
 * OAuth users typically don't have passwords initially
 */
export async function hasPasswordSet(): Promise<boolean> {
    try {
        const attributes = await fetchUserAttributes();

        // Check if user has identities (OAuth providers)
        // If they signed up via OAuth and haven't set a password, they won't have one
        // This is a heuristic - Cognito doesn't directly expose "has password" status

        // Users with OAuth identities might not have passwords
        // We'll use the presence of 'identities' attribute as a hint
        const identities = attributes['identities'];

        // If identities exists and is not empty, user likely signed up via OAuth
        // However, they may have set a password later
        // We'll return false for OAuth users by default, and the password change
        // will fail gracefully if they try to change a non-existent password

        return !identities;
    } catch (error) {
        console.error('Error checking password status:', error);
        // Default to true (assume they have a password)
        return true;
    }
}

/**
 * Gets the authentication provider used by the user
 */
export async function getAuthProvider(): Promise<'email' | 'google' | 'unknown'> {
    try {
        const attributes = await fetchUserAttributes();
        const identities = attributes['identities'];

        if (identities) {
            // Parse identities JSON if it's a string
            try {
                const identitiesData = typeof identities === 'string'
                    ? JSON.parse(identities)
                    : identities;

                if (Array.isArray(identitiesData) && identitiesData.length > 0) {
                    const provider = identitiesData[0].providerName?.toLowerCase();
                    if (provider === 'google') return 'google';
                }
            } catch (e) {
                // Failed to parse identities
            }
        }

        // If no identities, user signed up with email/password
        return identities ? 'unknown' : 'email';
    } catch (error) {
        console.error('Error getting auth provider:', error);
        return 'unknown';
    }
}
