'use client';

import { useFormStatus } from 'react-dom';
import { Loader2, Plus } from 'lucide-react';

interface SubmitButtonProps {
    label?: string;
    loadingLabel?: string;
    icon?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'ghost';
    title?: string;
}

export function SubmitButton({
                                 label,
                                 loadingLabel = 'Loading...',
                                 icon = <Plus className="w-4 h-4" />,
                                 className,
                                 variant = 'default',
                                 title,
                             }: SubmitButtonProps) {
    const { pending } = useFormStatus();

    if (variant === 'ghost') {
        return (
            <button
                type="submit"
                disabled={pending}
                title={title}
                className={
                    className ||
                    'text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed'
                }
            >
                {pending ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : icon}
            </button>
        );
    }

    return (
        <button
            type="submit"
            disabled={pending}
            title={title}
            className={
                className ||
                'w-full sm:w-auto px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-medium text-sm rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 h-[38px]'
            }
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{loadingLabel}</span>
                </>
            ) : (
                <>
                    {icon}
                    {label && <span>{label}</span>}
                </>
            )}
        </button>
    );
}