'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { createTransaction, getCategories } from '@/app/actions/transactions';

interface Category {
    id: string;
    name: string;
    color?: string | null;
}

export function AddTransactionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categoryList, setCategoryList] = useState<Category[]>([]);

    // Form states
    const [type, setType] = useState<'income' | 'expense'>('expense'); // 👈 Default to Expense
    const [payee, setPayee] = useState('');
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            getCategories().then((res) => {
                if (res.success && res.data) {
                    setCategoryList(res.data);
                }
            });
        }
    }, [isOpen]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Convert amount to negative if Expense is selected
        const parsedAmount = Math.abs(parseFloat(amount));
        const finalAmount = type === 'expense' ? -parsedAmount : parsedAmount;

        const res = await createTransaction({
            payee,
            amount: finalAmount.toString(),
            categoryId: categoryId || undefined,
            date: new Date(date),
            notes: notes || undefined,
        });

        setLoading(false);

        if (res.success) {
            setIsOpen(false);
            // Reset form
            setPayee('');
            setAmount('');
            setCategoryId('');
            setNotes('');
            setType('expense');
        } else {
            setError(res.error || 'Something went wrong');
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                Add Transaction
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 w-full max-w-md rounded-xl p-6 shadow-xl space-y-5">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                                New Transaction
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 💳 Income vs Expense Type Selector */}
                            <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setType('expense')}
                                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                        type === 'expense'
                                            ? 'bg-rose-500 text-white shadow-sm'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                    }`}
                                >
                                    <ArrowDownLeft className="w-4 h-4" />
                                    Expense (Debit)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setType('income')}
                                    className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                                        type === 'income'
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                    }`}
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                    Income (Credit)
                                </button>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                    Payee / Merchant
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Starbucks, Salary, Netflix"
                                    value={payee}
                                    onChange={(e) => setPayee(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Amount ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        required
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                    Category
                                </label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                                >
                                    <option value="">Uncategorized</option>
                                    {categoryList.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    placeholder="Add any extra details..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Transaction'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}