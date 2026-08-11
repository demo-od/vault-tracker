import { db } from '@/db';
import { users, categories } from '@/db/schema';
import { getTransactions, createTransaction } from '@/app/actions/transactions';

export default async function HomePage() {
    // 1. For testing, ensure we have a dummy user and category in Neon
    let [testUser] = await db.select().from(users).limit(1);

    if (!testUser) {
        [testUser] = await db
            .insert(users)
            .values({ name: 'Alex Developer', email: 'alex@example.com' })
            .returning();
    }

    let [testCategory] = await db.select().from(categories).limit(1);
    if (!testCategory) {
        [testCategory] = await db
            .insert(categories)
            .values({ userId: testUser.id, name: 'Groceries', color: '#10B981' })
            .returning();
    }

    // 2. Inline Server Action triggered by a form submit
    async function handleAddTransaction(formData: FormData) {
        'use server';

        const payee = formData.get('payee') as string;
        const amount = formData.get('amount') as string;

        if (!payee || !amount) return;

        await createTransaction({
            userId: testUser.id,
            categoryId: testCategory.id,
            payee,
            amount,
            date: new Date(),
        });
    }

    // 3. Fetch current transactions for this user
    const { data: transactionList } = await getTransactions(testUser.id);

    return (
        <main className="max-w-2xl mx-auto p-8 space-y-8 font-sans">
            <h1 className="text-3xl font-bold tracking-tight">Vault Expense Tracker</h1>

            {/* Form to Add Transaction */}
            <section className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>
                <form action={handleAddTransaction} className="flex gap-3">
                    <input
                        type="text"
                        name="payee"
                        placeholder="Store / Merchant (e.g. Walmart)"
                        required
                        className="flex-1 px-3 py-2 border rounded-md text-sm"
                    />
                    <input
                        type="number"
                        step="0.01"
                        name="amount"
                        placeholder="Amount ($)"
                        required
                        className="w-32 px-3 py-2 border rounded-md text-sm"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                        Add
                    </button>
                </form>
            </section>

            {/* Display List of Transactions */}
            <section className="space-y-3">
                <h2 className="text-lg font-semibold">Recent Transactions</h2>
                {!transactionList || transactionList.length === 0 ? (
                    <p className="text-slate-500 text-sm">No transactions found. Add one above!</p>
                ) : (
                    <ul className="divide-y border rounded-xl overflow-hidden">
                        {transactionList.map((tx) => (
                            <li key={tx.id} className="p-4 flex justify-between items-center bg-white">
                                <div>
                                    <p className="font-medium text-slate-900">{tx.payee}</p>
                                    <p className="text-xs text-slate-500">{tx.categoryName || 'Uncategorized'}</p>
                                </div>
                                <span className="font-semibold text-slate-900">${tx.amount}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}