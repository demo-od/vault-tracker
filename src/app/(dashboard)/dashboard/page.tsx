import { getTransactions, getDashboardSummary, deleteTransaction } from '@/app/actions/transactions';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { DeleteButton } from '@/components/delete-button';

export default async function DashboardPage() {
    const [txRes, summaryRes] = await Promise.all([
        getTransactions(),
        getDashboardSummary(),
    ]);

    const transactionsList = txRes.success && txRes.data ? txRes.data : [];
    const summary = summaryRes.success && summaryRes.data
        ? summaryRes.data
        : { netBalance: 0, totalIncome: 0, totalExpenses: 0 };

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
                <AddTransactionModal />
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span className="text-[11px] font-bold tracking-wider uppercase">
                            Net Balance
                        </span>
                        <Wallet className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                        ${summary.netBalance.toFixed(2)}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span className="text-[11px] font-bold tracking-wider uppercase">
                            Total Income
                        </span>
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        +${summary.totalIncome.toFixed(2)}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                        <span className="text-[11px] font-bold tracking-wider uppercase">
                            Total Expenses
                        </span>
                        <TrendingDown className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                        -${summary.totalExpenses.toFixed(2)}
                    </p>
                </div>
            </div>



            {/* Transactions List */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Recent Transactions
                    </h2>
                </div>

                {transactionsList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        No transactions found. Click "Add Transaction" to create one!
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {transactionsList.map((tx) => {
                            const isExpense = Number(tx.amount) < 0;
                            return (
                                <div
                                    key={tx.id}
                                    className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                            {tx.payee}
                                        </p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {tx.categoryName || 'Uncategorized'} •{' '}
                                            {new Date(tx.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`text-sm font-semibold ${
                                                isExpense
                                                    ? 'text-rose-600 dark:text-rose-400'
                                                    : 'text-emerald-600 dark:text-emerald-400'
                                            }`}
                                        >
                                            {isExpense ? '-' : '+'}$
                                            {Math.abs(Number(tx.amount)).toFixed(2)}
                                        </span>

                                        <form
                                            action={async () => {
                                                'use server';
                                                await deleteTransaction(tx.id);
                                            }}
                                        >
                                            <DeleteButton title="Delete transaction" />
                                        </form>
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