export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {LayoutDashboard, Tags, BarChart3, Receipt, LogOut, Settings} from 'lucide-react';

export default async function DashboardLayout({
                                                  children,
                                              }: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 flex flex-col md:flex-row transition-colors">
            <aside className="w-full md:w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 flex flex-col justify-between">
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold text-sm">
                                V
                            </div>
                            <span className="text-lg font-bold tracking-tight">Vault</span>
                        </div>
                        <ThemeToggle />
                    </div>

                    <nav className="space-y-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Overview
                        </Link>
                        <Link
                            href="/transactions"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <Receipt className="w-4 h-4" />
                            Transactions
                        </Link>
                        <Link
                            href="/analytics"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Analytics
                        </Link>
                        <Link
                            href="/categories"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <Tags className="w-4 h-4" />
                            Categories
                        </Link>

                        <Link
                            href="/settings"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>
                    </nav>
                </div>

                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div className="truncate">
                        <p className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100">
                            {session.user.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            {session.user.email}
                        </p>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await auth.api.signOut({
                                headers: await headers(),
                            });
                            redirect('/login');
                        }}
                    >
                        <button
                            type="submit"
                            className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}