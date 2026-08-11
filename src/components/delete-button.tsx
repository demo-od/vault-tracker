'use client';

import { useFormStatus } from 'react-dom';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteButton({ title = 'Delete' }: { title?: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            title={title}
            className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {pending ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}