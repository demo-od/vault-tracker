'use client';

import { useState } from 'react';
import { updateProfileName, deleteAccount } from '@/app/actions/settings';
import { User, Lock, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface SettingsFormsProps {
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export function SettingsForms({ user }: SettingsFormsProps) {
    // Split full name into First & Last
    const nameParts = user.name.split(' ');
    const initialFirstName = nameParts[0] || '';
    const initialLastName = nameParts.slice(1).join(' ') || '';

    const [firstName, setFirstName] = useState(initialFirstName);
    const [lastName, setLastName] = useState(initialLastName);
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [nameMessage, setNameMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    async function handleNameSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsUpdatingName(true);
        setNameMessage(null);

        const res = await updateProfileName(firstName, lastName);
        setIsUpdatingName(false);

        if (res.success) {
            setNameMessage({ type: 'success', text: 'Name updated successfully!' });
        } else {
            setNameMessage({ type: 'error', text: res.error || 'Failed to update name' });
        }
    }

    async function handleDeleteAccount() {
        setIsDeleting(true);
        await deleteAccount();
    }

    return (
        <div className="space-y-6 w-full">
            {/* 👤 Profile Information */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <User className="w-5 h-5 text-neutral-500" />
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                        Profile Information
                    </h2>
                </div>

                {nameMessage && (
                    <div
                        className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                            nameMessage.type === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                        }`}
                    >
                        {nameMessage.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        <span>{nameMessage.text}</span>
                    </div>
                )}

                <form onSubmit={handleNameSubmit} className="space-y-4">
                    {/* First & Last Name Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-neutral-400">
                            Email address cannot be changed directly for security purposes.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isUpdatingName}
                            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50 cursor-pointer"
                        >
                            {isUpdatingName ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* 🔒 Account Security */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <Lock className="w-5 h-5 text-neutral-500" />
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                        Account Security
                    </h2>
                </div>

                <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-900">
                        <div>
                            <p className="font-semibold text-neutral-900 dark:text-white">
                                Authentication Protection
                            </p>
                            <p className="text-[11px] text-neutral-500">
                                Better Auth Session Protection Active
                            </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                            Protected
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-semibold text-neutral-900 dark:text-white">
                                Account ID
                            </p>
                            <p className="text-[11px] text-neutral-500 font-mono">
                                {user.id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ⚠️ Danger Zone (Delete Account) */}
            <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-rose-200 dark:border-rose-900/50 pb-3">
                    <Trash2 className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                    <h2 className="text-base font-bold text-rose-900 dark:text-rose-300">
                        Danger Zone
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            Delete Account
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Permanently remove your account and all associated transaction records.
                        </p>
                    </div>

                    {!showDeleteConfirm ? (
                        <button
                            type="button"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}