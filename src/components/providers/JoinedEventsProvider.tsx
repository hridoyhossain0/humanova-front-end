
'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { authClient } from '@/lib/auth-client';
import { getTokenFromClient } from '@/lib/getTokenFromClient';

type JoinedEventsContextValue = {
    joinedEventIds: string[];
    loading: boolean;
    isJoined: (eventId: string) => boolean;
    markJoined: (eventId: string) => void;
    markLeft: (eventId: string) => void;
    refresh: () => Promise<void>;
};

const JoinedEventsContext =
    createContext<JoinedEventsContextValue | null>(null);

// Safe initial value for server rendering.
const initialContextValue: JoinedEventsContextValue = {
    joinedEventIds: [],
    loading: false,
    isJoined: () => false,
    markJoined: () => { },
    markLeft: () => { },
    refresh: async () => { },
};

type JoinedRecord = {
    eventId?: string | { _id?: string };
    form?: { _id?: string };
    event?: { _id?: string };
};

function extractEventId(item: JoinedRecord): string {
    if (typeof item.eventId === 'string') {
        return item.eventId;
    }

    if (
        item.eventId &&
        typeof item.eventId === 'object' &&
        typeof item.eventId._id === 'string'
    ) {
        return item.eventId._id;
    }

    return item.form?._id || item.event?._id || '';
}

// Outer provider: renders safely during server prerendering.
export function JoinedEventsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <JoinedEventsContext.Provider value={initialContextValue}>
                {children}
            </JoinedEventsContext.Provider>
        );
    }

    return (
        <JoinedEventsClientProvider>
            {children}
        </JoinedEventsClientProvider>
    );
}

// Inner provider: Better Auth session hook runs only in the browser.
function JoinedEventsClientProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, isPending } = authClient.useSession();

    const email = session?.user?.email;

    const [joinedEventIds, setJoinedEventIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!email || !apiUrl) {
            setJoinedEventIds([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const token = await getTokenFromClient();

            if (!token) {
                setJoinedEventIds([]);
                return;
            }

            const query = new URLSearchParams({ email });

            const res = await fetch(`${apiUrl}/joined?${query}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                cache: 'no-store',
            });

            const result = await res.json().catch(() => []);

            if (!res.ok) {
                throw new Error(
                    result?.message || 'Failed to load joined events.'
                );
            }

            const records: JoinedRecord[] = Array.isArray(result)
                ? result
                : (
                    result?.data ||
                    result?.joinedEvents ||
                    []
                );

            const ids = records
                .map(extractEventId)
                .filter((id): id is string => Boolean(id));

            setJoinedEventIds([...new Set(ids)]);
        } catch (error) {
            console.error('Joined events sync failed:', error);
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (isPending) return;

        void refresh();
    }, [isPending, refresh]);

    const markJoined = useCallback((eventId: string) => {
        setJoinedEventIds((current) =>
            current.includes(eventId)
                ? current
                : [...current, eventId]
        );
    }, []);

    const markLeft = useCallback((eventId: string) => {
        setJoinedEventIds((current) =>
            current.filter((id) => id !== eventId)
        );
    }, []);

    const isJoined = useCallback(
        (eventId: string) => joinedEventIds.includes(eventId),
        [joinedEventIds]
    );

    const value = useMemo(
        () => ({
            joinedEventIds,
            loading,
            isJoined,
            markJoined,
            markLeft,
            refresh,
        }),
        [
            joinedEventIds,
            loading,
            isJoined,
            markJoined,
            markLeft,
            refresh,
        ]
    );

    return (
        <JoinedEventsContext.Provider value={value}>
            {children}
        </JoinedEventsContext.Provider>
    );
}

export function useJoinedEvents() {
    const context = useContext(JoinedEventsContext);

    if (!context) {
        throw new Error(
            'useJoinedEvents must be used inside JoinedEventsProvider.'
        );
    }

    return context;
}
