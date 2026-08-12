import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SettingsForms } from '@/components/settings-forms';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    // Fetch user data including currency preference
    const users = await db
        .select({
            currency: user.currency,
        })
        .from(user)
        .where(eq(user.id, session.user.id))
        .limit(1);

    const userData = users[0];

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Manage your personal account information and preferences.
                </p>
            </div>

            <SettingsForms
                user={{
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    currency: userData?.currency || 'USD',
                }}
            />
        </div>
    );
}