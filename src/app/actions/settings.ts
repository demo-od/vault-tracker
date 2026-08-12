'use server';

import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * Update First Name and Last Name
 */
export async function updateProfileName(firstName: string, lastName: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

        if (!fullName) {
            return { success: false, error: 'Name cannot be empty' };
        }

        await db
            .update(user)
            .set({ name: fullName, updatedAt: new Date() })
            .where(eq(user.id, session.user.id));

        revalidatePath('/settings');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Failed to update name:', error);
        return { success: false, error: 'Could not update profile name' };
    }
}

/**
 * Update User Currency
 */
export async function updateCurrency(currency: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        await db
            .update(user)
            .set({ currency, updatedAt: new Date() })
            .where(eq(user.id, session.user.id));

        revalidatePath('/settings');
        revalidatePath('/dashboard');
        revalidatePath('/transactions');
        revalidatePath('/analytics');
        return { success: true };
    } catch (error) {
        console.error('Failed to update currency:', error);
        return { success: false, error: 'Could not update currency' };
    }
}

/**
 * Permanently Delete Account
 */
export async function deleteAccount() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        // Remove user record (Cascade will clean up sessions, transactions, etc.)
        await db.delete(user).where(eq(user.id, session.user.id));
    } catch (error) {
        console.error('Failed to delete account:', error);
        return { success: false, error: 'Failed to delete account' };
    }

    // Sign out and redirect to login
    redirect('/login');
}