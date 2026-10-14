'use client';

import { useEffect, useState } from 'react';
import { getTransactions, getDashboardSummary, deleteTransaction } from '@/app/actions/transactions';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { DeleteButton } from '@/components/delete-button';
import { formatCurrency } from '@/lib/currency';

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [summary, setSummary] = useState({ netBalance: 0, totalIncome: 0, totalExpenses: 0 });
    const [loading, setLoading] = useState(true);
    const [userCurrency, setUserCurrency] = useState('USD');

    useEffect(() => {
        async function loadData() {
            const [txRes, summaryRes] = await Promise.all([
                getTransactions(),
                getDashboardSummary(),
            ]);

            if (txRes.success && txRes.data) {
                setTransactions(txRes.data);
            }
            if (summaryRes.success && summaryRes.data) {
                setSummary(summaryRes.data);
            }
            setLoading(false);
        }

        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteTransaction(id);
        // Reload data
        const [txRes, summaryRes] = await Promise.all([
            getTransactions(),
            getDashboardSummary(),
        ]);
        if (txRes.success && txRes.data) setTransactions(txRes.data);
        if (summaryRes.success && summaryRes.data) setSummary(summaryRes.data);
    };

    return (
        <div className="space-y-8">
            {/* Header & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Overview
                    </h1>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        Summary of your balance, income, and recent cashflow.
                    </p>
                </div>
                <AddTransactionModal currency={userCurrency} />
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                            Net Balance
                        </span>
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(summary.netBalance, userCurrency)}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                            Total Income
                        </span>
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(summary.totalIncome, userCurrency)}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-3 sm:col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase">
                            Total Expenses
                        </span>
                        <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400">
                        -{formatCurrency(summary.totalExpenses, userCurrency)}
                    </p>
                </div>
            </div>



            {/* Transactions List */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-3 sm:p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Recent Transactions
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        Loading...
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        No transactions found. Click "Add Transaction" to create one!
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {transactions.map((tx) => {
                            const isExpense = Number(tx.amount) < 0;
                            return (
                                <div
                                    key={tx.id}
                                    className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                                >
                                    <div className="space-y-0.5 flex-1">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                            {tx.payee}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {tx.categoryName || 'Uncategorized'} •{' '}
                                            {new Date(tx.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                                        <span
                                            className={`text-sm font-semibold ${
                                                isExpense
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-emerald-600 dark:text-emerald-400'
                                            }`}
                                        >
                                            {isExpense ? '-' : '+'}
                                            {formatCurrency(Math.abs(Number(tx.amount)), userCurrency)}
                                        </span>

                                        <DeleteButton 
                                            title="Delete transaction" 
                                            onClick={() => handleDelete(tx.id)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}