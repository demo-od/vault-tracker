'use server';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

/**
 * Create a new Category
 */
export async function createCategory(name: string, color?: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        if (!name.trim()) {
            return { success: false, error: 'Category name is required' };
        }

        const [newCategory] = await db
            .insert(categories)
            .values({
                userId: session.user.id,
                name: name.trim(),
                color: color || '#6366f1', // Default hex color
            })
            .returning();

        revalidatePath('/categories');
        revalidatePath('/dashboard');

        return { success: true, data: newCategory };
    } catch (error) {
        console.error('Failed to create category:', error);
        return { success: false, error: 'Failed to create category' };
    }
}

/**
 * Delete a Category
 */
export async function deleteCategory(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        await db
            .delete(categories)
            .where(
                and(
                    eq(categories.id, id),
                    eq(categories.userId, session.user.id)
                )
            );

        revalidatePath('/categories');
        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}