import { getCategories, getTransactions, deleteTransaction } from '@/app/actions/transactions';
import { AddTransactionModal } from '@/components/add-transaction-modal';
import { DeleteButton } from '@/components/delete-button';
import { TransactionsFilter } from '@/components/transactions-filter';

export default async function TransactionsPage({
                                                   searchParams,
                                               }: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const params = await searchParams;
    const query = params.q?.toLowerCase() || '';
    const selectedCategory = params.category || 'all';

    const [txRes, catRes] = await Promise.all([
        getTransactions(),
        getCategories(),
    ]);

    const rawTransactions = txRes.success && txRes.data ? txRes.data : [];
    const categoriesList = catRes.success && catRes.data ? catRes.data : [];

    // Filter transactions server-side or in-memory
    const filteredTransactions = rawTransactions.filter((tx) => {
        const matchesQuery =
            !query ||
            tx.payee.toLowerCase().includes(query) ||
            (tx.notes && tx.notes.toLowerCase().includes(query));

        const matchesCategory =
            selectedCategory === 'all' || tx.categoryId === selectedCategory;

        return matchesQuery && matchesCategory;
    });

    return (
        <div className="space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Transactions
                    </h1>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                        View, search, filter, and manage all your income and expenses.
                    </p>
                </div>
                <AddTransactionModal />
            </div>

            {/* Filter Bar */}
            <TransactionsFilter
                categories={categoriesList}
                transactions={filteredTransactions}
            />

            {/* Transactions Master Table */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                        All Records ({filteredTransactions.length})
                    </span>
                </div>

                {filteredTransactions.length === 0 ? (
                    <div className="p-12 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        No transactions found matching your filter criteria.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {filteredTransactions.map((tx) => {
                            const isExpense = Number(tx.amount) < 0;
                            return (
                                <div
                                    key={tx.id}
                                    className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                {tx.payee}
                                            </p>
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-medium">
                                                {tx.categoryName || 'Uncategorized'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {new Date(tx.date).toLocaleDateString()}
                                            {tx.notes ? ` • ${tx.notes}` : ''}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`text-sm font-bold ${
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