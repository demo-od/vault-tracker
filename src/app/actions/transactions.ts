'use server';

import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Type definition for creating a new transaction
export type CreateTransactionInput = {
    userId: string;
    categoryId?: string;
    amount: string; // Stored as string to preserve exact decimal precision for numeric()
    payee: string;
    notes?: string;
    date: Date;
};

/**
 * Fetch all transactions for a specific user, joined with category details
 */
export async function getTransactions(userId: string) {
    try {
        const data = await db
            .select({
                id: transactions.id,
                amount: transactions.amount,
                payee: transactions.payee,
                notes: transactions.notes,
                date: transactions.date,
                categoryName: categories.name,
                categoryColor: categories.color,
            })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(eq(transactions.userId, userId))
            .orderBy(desc(transactions.date));

        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return { success: false, error: 'Could not fetch transactions' };
    }
}

/**
 * Create a new transaction record
 */
export async function createTransaction(input: CreateTransactionInput) {
    try {
        const [newTransaction] = await db
            .insert(transactions)
            .values({
                userId: input.userId,
                categoryId: input.categoryId || null,
                amount: input.amount,
                payee: input.payee,
                notes: input.notes,
                date: input.date,
            })
            .returning(); // Returns the newly inserted record immediately

        // Tell Next.js to purge its client cache for the dashboard so fresh data displays immediately
        revalidatePath('/dashboard');

        return { success: true, data: newTransaction };
    } catch (error) {
        console.error('Failed to create transaction:', error);
        return { success: false, error: 'Failed to create transaction' };
    }
}