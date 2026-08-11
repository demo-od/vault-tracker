import { useState } from 'react';

export function useCheckEmail() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkEmail = async (email: string): Promise<boolean> => {
        setLoading(true);
        setError(null);

        try {
            // Try to sign up with the email - if it fails with duplicate error, email exists
            const response = await fetch('/api/auth/sign-up/email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password: 'test-password-123', // Temporary password for checking
                    name: 'Test User',
                }),
            });

            const data = await response.json();

            // If response contains error about existing email, return true
            if (data.error && (
                data.error.toLowerCase().includes('already') ||
                data.error.toLowerCase().includes('exists') ||
                data.message?.toLowerCase().includes('already') ||
                data.message?.toLowerCase().includes('exists')
            )) {
                return true;
            }

            // If signup succeeded (unlikely with test password), email doesn't exist
            if (response.ok) {
                return false;
            }

            // For other errors, assume email doesn't exist
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check email');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { checkEmail, loading, error };
}
