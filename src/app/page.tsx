import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col justify-between selection:bg-neutral-900 selection:text-white dark:selection:bg-neutral-100 dark:selection:text-black">
            {/* Header */}
            <header className="max-w-6xl w-full mx-auto p-6 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-900">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold">
                        V
                    </div>
                    <span className="text-xl font-bold tracking-tight">Vault</span>
                </div>
                <div className="flex gap-4 items-center">
                    <ThemeToggle />
                    <Link
                        href="/login"
                        className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero Content */}
            <main className="max-w-4xl mx-auto px-6 text-center space-y-8 py-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-xs font-medium text-neutral-800 dark:text-neutral-200">
                    <span>Personal Wealth Tracking</span>
                </div>

                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
                    Master Your Money with <br />
                    <span className="underline decoration-neutral-400 dark:decoration-neutral-600 underline-offset-8">
            Monochrome Precision.
          </span>
                </h1>

                <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                    Gain complete control over your cash flow, track expenses, monitor savings, and make informed financial decisions with zero distractions.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm"
                    >
                        Launch Tracker
                    </Link>
                </div>
        </main>

            {/* Footer */}
            <footer className="border-t border-neutral-200 dark:border-neutral-900 py-6 text-center text-xs text-neutral-500">
                © Vault Expense Tracker. All rights reserved.
            </footer>
        </div>
    );
}