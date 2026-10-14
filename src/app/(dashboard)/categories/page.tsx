'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/app/actions/transactions';
import { createCategory, deleteCategory } from '@/app/actions/categories';
import { SubmitButton } from '@/components/submit-button';
import { DeleteButton } from '@/components/delete-button';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const res = await getCategories();
            if (res.success && res.data) {
                setCategories(res.data);
            }
            setLoading(false);
        }

        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        await deleteCategory(id);
        const res = await getCategories();
        if (res.success && res.data) {
            setCategories(res.data);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Categories
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Organize your transactions with custom categories.
                </p>
            </div>

            {/* Add Category Form */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm">
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
                    Create New Category
                </h2>

                <form
                    action={async (formData: FormData) => {
                        'use server';
                        const name = formData.get('name') as string;
                        const color = formData.get('color') as string;
                        if (name) {
                            await createCategory(name, color);
                        }
                    }}
                    className="flex flex-col sm:flex-row gap-3 items-end"
                >
                    <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Category Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Groceries, Rent, Freelance"
                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                        />
                    </div>

                    <div className="w-full sm:w-28">
                        <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Badge Color
                        </label>
                        <input
                            type="color"
                            name="color"
                            defaultValue="#6366f1"
                            className="w-full h-[38px] p-1 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-lg cursor-pointer"
                        />
                    </div>

                    <SubmitButton label="Add Category" loadingLabel="Saving..." />
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Your Categories
                    </h2>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        Loading...
                    </div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                        No custom categories created yet.
                    </div>
                ) : (
                    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                className="p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: cat.color || '#6366f1' }}
                                    />
                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {cat.name}
                                    </span>
                                </div>

                                <DeleteButton 
                                    title="Delete category" 
                                    onClick={() => handleDelete(cat.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}