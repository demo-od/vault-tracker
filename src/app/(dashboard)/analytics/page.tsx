import {
    getCategoryBreakdown,
    getDashboardSummary,
    getMonthlyAnalytics,
    getTransactions,
} from '@/app/actions/transactions';
import { AnalyticsCharts } from '@/components/analytics-charts';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function AnalyticsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    // Fetch user currency preference
    let userCurrency = 'USD';
    if (session) {
        const users = await db
            .select({
                currency: user.currency,
            })
            .from(user)
            .where(eq(user.id, session.user.id))
            .limit(1);
        userCurrency = users[0]?.currency || 'USD';
    }

    const [summaryRes, breakdownRes, monthlyRes, txRes] = await Promise.all([
        getDashboardSummary(),
        getCategoryBreakdown(),
        getMonthlyAnalytics(),
        getTransactions(),
    ]);

    const summary =
        summaryRes.success && summaryRes.data
            ? summaryRes.data
            : { netBalance: 0, totalIncome: 0, totalExpenses: 0 };

    const breakdown =
        breakdownRes.success && breakdownRes.data ? breakdownRes.data.breakdown : [];

    const monthlyData =
        monthlyRes.success && monthlyRes.data ? monthlyRes.data : [];

    const transactionsList = txRes.success && txRes.data ? txRes.data : [];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Analytics
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Visual insights, key performance indicators, and graphical reports.
                </p>
            </div>

            <AnalyticsCharts
                breakdown={breakdown}
                monthlyData={monthlyData}
                totalIncome={summary.totalIncome}
                totalExpenses={summary.totalExpenses}
                transactionCount={transactionsList.length}
                currency={userCurrency}
            />
        </div>
    );
}