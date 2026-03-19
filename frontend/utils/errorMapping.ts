/**
 * Maps raw Firebase authentication error codes to user-friendly messages.
 * 
 * @param code The Firebase error code or raw error message
 * @returns A user-friendly error string suitable for UI display
 */
export const getAuthErrorMessage = (code: string): string => {
    // If it's a generic message instead of a code, or undefined
    if (!code) return 'An unexpected error occurred. Please try again.';

    // Firebase Error Codes mapping
    switch (code) {
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up or check your spelling.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-email':
            return 'The email address is invalid. Please check for typos and extra spaces.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/email-already-in-use':
            return 'An account already exists with this email address. Please sign in instead.';
        case 'auth/weak-password':
            return 'The password is too weak. Please use a stronger password (at least 6 characters).';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is currently disabled. Please contact support.';
        case 'auth/invalid-credential':
            return 'Invalid login credentials. Please check your email and password.';
        case 'auth/too-many-requests':
            return 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection and try again.';
        case 'auth/popup-closed-by-user':
            return 'The Google sign-in popup was closed before finishing.';
        case 'auth/popup-blocked':
            return 'The Google sign-in popup was blocked by your browser. Please allow popups for this site.';
        default:
            // If the code is just a generic error message passed directly
            if (code.includes('Failed to')) return code;
            if (code.includes('auth/')) return 'Authentication error. Please try again.';
            
            // Clean up raw Firebase message if it somehow gets passed: "Firebase: Error (auth/...)"
            if (code.includes('Firebase:')) {
                 return 'An authentication error occurred. Please check your details and try again.';
            }

            return code || 'An unexpected error occurred. Please try again.';
    }
};
