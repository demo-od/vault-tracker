'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Tags, BarChart3, Receipt, LogOut, Settings, Menu, X, Loader2 } from 'lucide-react';
import { signOutAction } from '@/app/actions/sign-out';

interface SidebarProps {
    user?: {
        name: string;
        email: string;
    };
}

export function Sidebar({ user: initialUser }: SidebarProps) {
    const [user, setUser] = useState(initialUser || { name: 'Vault', email: '' });

    useEffect(() => {
        if (!initialUser) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Failed to parse stored user:', e);
                }
            }
        }
    }, [initialUser]);

    const [signingOut, setSigningOut] = useState(false);

    const handleSignOut = async () => {
        setSigningOut(true);
        try {
            localStorage.removeItem('user');
            await signOutAction();
        } finally {
            setSigningOut(false);
        }
    };
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/transactions', label: 'Transactions', icon: Receipt },
        { href: '/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/categories', label: 'Categories', icon: Tags },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden w-full h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 flex items-center justify-between sticky top-0 z-50 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold text-sm">
                        V
                    </div>
                    <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Vault</span>
                </div>

                <button
                    onClick={toggleMenu}
                    className="p-2 text-neutral-500 hover:text-black dark:hover:text-white rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 transition-colors cursor-pointer"
                    aria-label="Toggle Menu"
                >
                    {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </header>

            {/* Mobile Expanded Menu overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-neutral-50 dark:bg-black z-40 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="space-y-6">
                        <nav className="space-y-2">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className={`flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
                                            isActive
                                                ? 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white'
                                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                        <div className="truncate">
                            <p className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100">
                                {user.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {user.email}
                            </p>
                        </div>
                        <button
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="p-2.5 text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Sign Out"
                        >
                            {signingOut ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <LogOut className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar (Permanent) */}
            <aside className="hidden lg:flex w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 flex-col justify-between h-screen sticky top-0 transition-colors">
                <div className="space-y-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold text-sm">
                            V
                        </div>
                        <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">Vault</span>
                    </div>

                    <nav className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white'
                                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <div className="truncate">
                        <p className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100">
                            {user.name}
                        </p>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Sign Out"
                    >
                        {signingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
