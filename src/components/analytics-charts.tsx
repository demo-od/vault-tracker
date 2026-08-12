'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from 'recharts';
import { Target, PiggyBank, Receipt, ShoppingBag } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '@/lib/currency';

interface BreakdownItem {
    name: string;
    total: number;
    color: string;
    percentage: number;
}

interface MonthlyItem {
    month: string;
    income: number;
    expense: number;
}

interface AnalyticsChartsProps {
    breakdown: BreakdownItem[];
    monthlyData: MonthlyItem[];
    totalIncome: number;
    totalExpenses: number;
    transactionCount: number;
    currency?: string;
}

export function AnalyticsCharts({
                                    breakdown,
                                    monthlyData,
                                    totalIncome,
                                    totalExpenses,
                                    transactionCount,
                                    currency = 'USD',
                                }: AnalyticsChartsProps) {
    const pieData =
        breakdown.length > 0
            ? breakdown
            : [{ name: 'No Data', total: 1, color: '#a3a3a3' }];

    const savings = totalIncome - totalExpenses;
    const savingsRate =
        totalIncome > 0 ? Math.max(0, Math.round((savings / totalIncome) * 100)) : 0;

    const avgTransactionSize =
        transactionCount > 0 ? (totalExpenses + totalIncome) / transactionCount : 0;

    const topCategory = breakdown.length > 0 ? breakdown[0] : null;

    const currencySymbol = getCurrencySymbol(currency);

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-neutral-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Savings Rate
                        </span>
                        <PiggyBank className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {savingsRate}%
                    </p>
                    <p className="text-[11px] text-neutral-500">
                        {savings >= 0 ? `+${formatCurrency(savings, currency)} saved` : 'Spending exceeds income'}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-neutral-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Top Expense
                        </span>
                        <ShoppingBag className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white truncate">
                        {topCategory ? topCategory.name : 'N/A'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                        {topCategory
                            ? `${formatCurrency(topCategory.total, currency)} (${topCategory.percentage}% of expenses)`
                            : 'No expense recorded'}
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-neutral-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Avg / Transaction
                        </span>
                        <Receipt className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(avgTransactionSize, currency)}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                        Across {transactionCount} total entry(ies)
                    </p>
                </div>

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-neutral-500">
                        <span className="text-xs font-semibold uppercase tracking-wider">
                            Burn Ratio
                        </span>
                        <Target className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                        {totalIncome > 0
                            ? `${((totalExpenses / totalIncome) * 100).toFixed(0)}%`
                            : '100%'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                        Expenses divided by total income
                    </p>
                </div>
            </div>

            {/* Graphical Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 📊 Multi-Month Bar Chart */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                        Monthly Income vs Expenses
                    </h2>
                    <div className="h-64 w-full">
                        {monthlyData.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-xs text-neutral-500">
                                No monthly activity to show yet.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                    <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickFormatter={(v) => `${currencySymbol}${v}`}
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            formatCurrency(Number(value || 0), currency),
                                        ]}
                                        contentStyle={{
                                            backgroundColor: '#171717',
                                            borderColor: '#404040',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                        Category Expenses
                    </h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="total"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={4}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [
                                        formatCurrency(Number(value || 0), currency),
                                        'Spent',
                                    ]}
                                    contentStyle={{
                                        backgroundColor: '#171717',
                                        borderColor: '#404040',
                                        borderRadius: '8px',
                                        color: '#fff',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs">
                        {breakdown.map((cat) => (
                            <div key={cat.name} className="flex items-center gap-1.5">
                                <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <span className="text-neutral-600 dark:text-neutral-400">
                                    {cat.name} ({formatCurrency(cat.total, currency)})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}