import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SettingsForms } from '@/components/settings-forms';

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

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
                }}
            />
        </div>
    );
}