export const dynamic = 'force-dynamic';

import { Sidebar } from '@/components/sidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

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
            <Sidebar user={{ name: session.user.name, email: session.user.email }} />
            <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
}