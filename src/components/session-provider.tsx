'use client';

import { createContext, useContext } from 'react';

interface Session {
    user: {
        id: string;
        email: string;
        name: string;
    };
}

interface SessionContextType {
    session: Session | null;
}

const SessionContext = createContext<SessionContextType>({ session: null });

export function SessionProvider({ 
    children, 
    session 
}: { 
    children: React.ReactNode; 
    session: Session | null;
}) {
    return (
        <SessionContext.Provider value={{ session }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
