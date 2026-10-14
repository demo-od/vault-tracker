'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteButton({ 
    title = 'Delete', 
    onClick 
}: { 
    title?: string; 
    onClick?: () => Promise<void> | void;
}) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (onClick) {
            setLoading(true);
            try {
                await onClick();
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <button
            type="button"
            disabled={loading}
            onClick={handleClick}
            title={title}
            className="text-neutral-400 hover:text-red-500 transition-colors p-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}