'use client';

import { Download, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

interface TransactionsFilterProps {
    categories: Array<{ id: string; name: string }>;
    transactions: Array<{
        id: string;
        payee: string;
        amount: string | number;
        date: Date | string;
        categoryName?: string | null;
        notes?: string | null;
    }>;
}

export function TransactionsFilter({ categories, transactions }: TransactionsFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    const currentSearch = searchParams.get('q') || '';
    const currentCategory = searchParams.get('category') || 'all';
    const currentType = searchParams.get('type') || 'all';
    const currentMonth = searchParams.get('month') || 'all';
    const currentYear = searchParams.get('year') || 'all';

    function updateParam(key: string, value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        startTransition(() => {
            router.push(`/transactions?${params.toString()}`);
        });
    }

    function exportToCSV() {
        if (!transactions.length) return;

        const headers = ['Payee', 'Amount', 'Category', 'Date', 'Notes'];
        const rows = transactions.map((tx) => [
            `"${tx.payee.replace(/"/g, '""')}"`,
            tx.amount,
            `"${(tx.categoryName || 'Uncategorized').replace(/"/g, '""')}"`,
            new Date(tx.date).toLocaleDateString(),
            `"${(tx.notes || '').replace(/"/g, '""')}"`,
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const currentYr = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYr - i);

    return (
        <div className="space-y-3">
            {/* Search Bar & Export CSV */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        defaultValue={currentSearch}
                        onChange={(e) => updateParam('q', e.target.value)}
                        placeholder="Search payee or notes..."
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                    />
                </div>

                <button
                    onClick={exportToCSV}
                    disabled={transactions.length === 0}
                    className="w-full sm:w-auto px-4 py-2 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Type Filter */}
                <select
                    value={currentType}
                    onChange={(e) => updateParam('type', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer"
                >
                    <option value="all">All Types</option>
                    <option value="income">Income (+)</option>
                    <option value="expense">Expenditure (-)</option>
                </select>

                {/* Category Filter */}
                <select
                    value={currentCategory}
                    onChange={(e) => updateParam('category', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                {/* Month Filter */}
                <select
                    value={currentMonth}
                    onChange={(e) => updateParam('month', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer"
                >
                    <option value="all">All Months</option>
                    <option value="0">January</option>
                    <option value="1">February</option>
                    <option value="2">March</option>
                    <option value="3">April</option>
                    <option value="4">May</option>
                    <option value="5">June</option>
                    <option value="6">July</option>
                    <option value="7">August</option>
                    <option value="8">September</option>
                    <option value="9">October</option>
                    <option value="10">November</option>
                    <option value="11">December</option>
                </select>

                {/* Year Filter */}
                <select
                    value={currentYear}
                    onChange={(e) => updateParam('year', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white cursor-pointer"
                >
                    <option value="all">All Years</option>
                    {years.map((y) => (
                        <option key={y} value={y.toString()}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}