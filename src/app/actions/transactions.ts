'use server';

import { db } from '@/db';
import { transactions, categories } from '@/db/schema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { eq, desc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type CreateTransactionInput = {
    categoryId?: string;
    amount: string;
    payee: string;
    notes?: string;
    date: Date;
};



/**
 * Calculate Overview Summary Metrics for the logged-in user
 */
export async function getDashboardSummary() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        const userTransactions = await db
            .select({
                amount: transactions.amount,
            })
            .from(transactions)
            .where(eq(transactions.userId, session.user.id));

        let totalIncome = 0;
        let totalExpenses = 0;

        userTransactions.forEach((tx) => {
            const val = Number(tx.amount);
            if (val >= 0) {
                totalIncome += val;
            } else {
                totalExpenses += Math.abs(val);
            }
        });

        const netBalance = totalIncome - totalExpenses;

        return {
            success: true,
            data: {
                netBalance,
                totalIncome,
                totalExpenses,
            },
        };
    } catch (error) {
        console.error('Failed to calculate summary:', error);
        return { success: false, error: 'Could not calculate summary' };
    }
}

/**
 * Fetch transactions ONLY for the currently authenticated user
 */
export async function getTransactions() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        const data = await db
            .select({
                id: transactions.id,
                amount: transactions.amount,
                payee: transactions.payee,
                notes: transactions.notes,
                date: transactions.date,
                categoryId: transactions.categoryId,
                categoryName: categories.name,
                categoryColor: categories.color,
            })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(eq(transactions.userId, session.user.id))
            .orderBy(desc(transactions.date));

        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return { success: false, error: 'Could not fetch transactions' };
    }
}

/**
 * Get category-wise spending breakdown for the current user
 */
export async function getCategoryBreakdown() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        // Fetch transactions joined with categories
        const userTransactions = await db
            .select({
                amount: transactions.amount,
                categoryName: categories.name,
                categoryColor: categories.color,
            })
            .from(transactions)
            .leftJoin(categories, eq(transactions.categoryId, categories.id))
            .where(eq(transactions.userId, session.user.id));

        const categoryMap: Record<string, { name: string; total: number; color: string }> = {};
        let totalExpenseSum = 0;

        userTransactions.forEach((tx) => {
            const val = Number(tx.amount);
            // Only aggregate expenses (negative amounts)
            if (val < 0) {
                const expense = Math.abs(val);
                totalExpenseSum += expense;
                const name = tx.categoryName || 'Uncategorized';
                const color = tx.categoryColor || '#6b7280';

                if (!categoryMap[name]) {
                    categoryMap[name] = { name, total: 0, color };
                }
                categoryMap[name].total += expense;
            }
        });

        const breakdown = Object.values(categoryMap).map((cat) => ({
            ...cat,
            percentage: totalExpenseSum > 0 ? Math.round((cat.total / totalExpenseSum) * 100) : 0,
        })).sort((a, b) => b.total - a.total);

        return {
            success: true,
            data: {
                totalExpenseSum,
                breakdown,
            },
        };
    } catch (error) {
        console.error('Failed to get category breakdown:', error);
        return { success: false, error: 'Could not fetch breakdown' };
    }
}

/**
 * Fetch categories for the current user
 */
export async function getCategories() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        const data = await db
            .select()
            .from(categories)
            .where(eq(categories.userId, session.user.id));

        return { success: true, data };
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return { success: false, error: 'Could not fetch categories' };
    }
}

/**
 * Create a new transaction assigned to the logged-in user
 */
export async function createTransaction(input: CreateTransactionInput) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        const [newTransaction] = await db
            .insert(transactions)
            .values({
                userId: session.user.id,
                categoryId: input.categoryId || null,
                amount: input.amount,
                payee: input.payee,
                notes: input.notes,
                date: input.date,
            })
            .returning();

        revalidatePath('/dashboard');

        return { success: true, data: newTransaction };
    } catch (error) {
        console.error('Failed to create transaction:', error);
        return { success: false, error: 'Failed to create transaction' };
    }
}

/**
 * Delete a transaction owned by the logged-in user
 */
export async function deleteTransaction(id: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        await db
            .delete(transactions)
            .where(
                and(
                    eq(transactions.id, id),
                    eq(transactions.userId, session.user.id)
                )
            );

        revalidatePath('/dashboard');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        return { success: false, error: 'Failed to delete transaction' };
    }


}

/**
 * Fetch monthly income vs expense aggregates for trend charts
 */
export async function getMonthlyAnalytics() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return { success: false, error: 'Unauthorized' };
        }

        const userTransactions = await db
            .select({
                amount: transactions.amount,
                date: transactions.date,
            })
            .from(transactions)
            .where(eq(transactions.userId, session.user.id));

        const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};

        userTransactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            // Format key as "Jan 2026" or "Jan"
            const monthKey = txDate.toLocaleString('default', { month: 'short' });

            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = { month: monthKey, income: 0, expense: 0 };
            }

            const val = Number(tx.amount);
            if (val >= 0) {
                monthlyMap[monthKey].income += val;
            } else {
                monthlyMap[monthKey].expense += Math.abs(val);
            }
        });

        const monthlyData = Object.values(monthlyMap);

        return {
            success: true,
            data: monthlyData,
        };
    } catch (error) {
        console.error('Failed to get monthly analytics:', error);
        return { success: false, error: 'Could not fetch monthly data', data: [] };
    }
}