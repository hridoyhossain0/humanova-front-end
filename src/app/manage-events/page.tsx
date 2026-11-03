'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
    CalendarDays,
    Plus,
    Search,

    LayoutGrid,
    RefreshCw,
    Trash2,
    X,
    AlertCircle,
    Loader2,
    PartyPopper,
    Eye,
    Pencil,

    ArrowUpRight,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { getTokenFromClient } from '@/lib/getTokenFromClient';
import { getApiUrl, hasApiUrl } from '@/lib/api';
import EventsCard from '@/components/events/EventsCard';
import EventDetailsModal from '@/components/events/EventDetailsModal';
import EditEventModal, {
    type ManageEventFormValues,
} from '@/components/events/EditEventModal';


// Local event shape returned by the manage-events API.
// Declared here so it does not resolve to the DOM's global `Event`.
type Event = {
    _id: string;
    title: string;
    location: string;
    description: string;
    eventType: string;
    imageUrl?: string;
    eventDate?: string;
    username?: string;
    email?: string;
    form?: {
        title?: string;
        description?: string;
        eventType?: string;
        imageUrl?: string;
        location?: string;
        eventDate?: string;
        _id?: string;
    };
};

type ApiResponse = {
    success?: boolean;
    message?: string;
    data?: Event[];
    events?: Event[];
};

export default function ManageEventPage() {
    const router = useRouter();

    // Better Auth session
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    // States
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [viewEvent, setViewEvent] = useState<Event | null>(null);
    const [editEvent, setEditEvent] = useState<Event | null>(null);

    const [notification, setNotification] = useState('');

    // Logged-in user
    const userEmail = session?.user?.email;

    // Fetch user's events

    const fetchMyEvents = useCallback(async (showSuccessToast = false) => {
        if (!hasApiUrl()) {
            setError('API URL is not configured. Set NEXT_PUBLIC_API_URL in Vercel environment variables.');
            setLoading(false);
            return;
        }

        if (!userEmail) {
            setError('No authenticated user found.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = await getTokenFromClient();

            if (!token) {
                throw new Error('Authentication token not found.');
            }

            const response = await fetch(
                `${getApiUrl()}/api/events/my`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    cache: 'no-store',
                }
            );

            const result: ApiResponse | Event[] =
                await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    !Array.isArray(result)
                        ? result.message || 'Failed to load events.'
                        : 'Failed to load events.'
                );
            }

            const eventList = Array.isArray(result)
                ? result
                : result.data || result.events || [];

            setEvents(eventList);

            if (showSuccessToast) {
                toast.success('Events refreshed', {
                    description: `${eventList.length} event${eventList.length === 1 ? '' : 's'} loaded.`,
                });
            }
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Something went wrong.';

            setError(message);

            toast.error('Could not load events', {
                description: message,
            });
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    // Authentication check and fetch
    useEffect(() => {
        if (sessionLoading) return;

        if (!session) {
            router.replace('/sign-in');
            return;
        }

        // Defer the fetch so the effect does not call setState synchronously.
        const timer = window.setTimeout(() => {
            void fetchMyEvents();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [session, sessionLoading, fetchMyEvents, router]);

// Categories
const categories = useMemo(() => {
    const uniqueCategories = [
        ...new Set(
            events
                .map((event) => event.eventType)
                .filter(Boolean)
        ),
    ];

    return ['All', ...uniqueCategories];
}, [events]);

// Search and filter
const filteredEvents = useMemo(() => {
    return events.filter((event) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            String(event.title || '')
                .toLowerCase()
                .includes(search) ||
            String(event.location || '')
                .toLowerCase()
                .includes(search) ||
            String(event.description || '')
                .toLowerCase()
                .includes(search);

        const matchesCategory =
            selectedCategory === 'All' ||
            event.eventType === selectedCategory;

        return matchesSearch && matchesCategory;
    });
}, [events, searchTerm, selectedCategory]);

// Delete event
const handleDelete = async () => {
    if (!deleteId) return;

    if (!hasApiUrl()) {
        setError('API URL is not configured.');
        return;
    }

    setDeleting(true);
    setError('');

    try {
        const token = await getTokenFromClient();

        if (!token) {
            throw new Error('Authentication token not found.');
        }

        const response = await fetch(
            `${getApiUrl()}/api/events/${deleteId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.message || 'Failed to delete event.'
            );
        }

        setEvents((previousEvents) =>
            previousEvents.filter(
                (event) => event._id !== deleteId
            )
        );

        setDeleteId(null);
        setNotification('Event deleted successfully!');

        toast.success('Event deleted', {
            description:
                'The event and its registrations have been removed.',
        });

        window.setTimeout(() => {
            setNotification('');
        }, 3000);

    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : 'Could not delete event.';

        setError(message);

        toast.error('Delete failed', {
            description: message,
        });
    } finally {
        setDeleting(false);
    }
};

// Update event
const handleUpdateEvent = async (values: ManageEventFormValues) => {
    if (!editEvent) return;

    try {
        if (!hasApiUrl()) {
            throw new Error('API URL is not configured.');
        }

        const token = await getTokenFromClient();

        if (!token) {
            throw new Error('Authentication token not found.');
        }

        const response = await fetch(
            `${getApiUrl()}/api/events/${editEvent._id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ form: values }),
            }
        );

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                result.message || 'Failed to update event.'
            );
        }

        const savedForm = result.event?.form ?? values;

        setEvents((previousEvents) =>
            previousEvents.map((event) =>
                event._id === editEvent._id
                    ? {
                        ...event,
                        ...savedForm,
                    }
                    : event
            )
        );

        setEditEvent(null);
        setNotification('Event updated successfully!');

        toast.success('Event updated', {
            description: `"${savedForm.title || values.title}" has been updated.`,
        });

        window.setTimeout(() => {
            setNotification('');
        }, 3000);
    } catch (err) {
        const message =
            err instanceof Error
                ? err.message
                : 'Could not update the event.';

        toast.error('Update failed', {
            description: message,
        });

        throw err instanceof Error ? err : new Error(message);
    }
};

// Loading session
if (sessionLoading || (!session && !sessionLoading)) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
                <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
                <p className="mt-4 text-sm font-medium text-gray-500">
                    Checking your account...
                </p>
            </div>
        </div>
    );
}

return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-10 sm:px-6 lg:px-10">

        <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <div className="mb-9 flex flex-col justify-between gap-6 border-b border-gray-200 pb-7 sm:flex-row sm:items-end">

                <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700">
                        <LayoutGrid size={14} />
                        Organizer Dashboard
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                        Manage My Events
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                        Manage your community initiatives in one
                        place. View, edit and organize the events
                        you&apos;ve created.
                    </p>
                </div>

                <Link
                    href="/create-event"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                >
                    <Plus size={19} />
                    Create New Event
                </Link>
            </div>

            {/* NOTIFICATION */}
            {notification && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                    <PartyPopper size={19} />
                    {notification}
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <div className="flex items-center gap-2">
                        <AlertCircle size={19} />
                        {error}
                    </div>

                    <button
                        onClick={() => setError('')}
                        aria-label="Dismiss error"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}


            {/* SEARCH AND FILTER */}
            <div className="mb-7 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">

                {/* Search */}
                <div className="relative w-full md:max-w-md">
                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title, location or description..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${selectedCategory === category
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* EVENT SECTION HEADER */}
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                        Your Initiatives
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        {filteredEvents.length} event
                        {filteredEvents.length !== 1 ? 's' : ''} found
                    </p>
                </div>

                <button
                    onClick={() => fetchMyEvents(true)}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Refresh
                </button>
            </div>

            {/* LOADING */}
            {loading ? (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="h-[430px] animate-pulse rounded-3xl border border-gray-200 bg-white"
                        >
                            <div className="h-52 rounded-t-3xl bg-gray-200" />
                            <div className="space-y-4 p-6">
                                <div className="h-5 w-3/4 rounded bg-gray-200" />
                                <div className="h-4 w-1/2 rounded bg-gray-200" />
                                <div className="h-16 rounded bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredEvents.length > 0 ? (

                /* EVENTS GRID */
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <EventsCard
                            key={event._id}
                            event={{
                                _id: event._id,
                                form: {
                                    title: event.title,
                                    description: event.description,
                                    eventType: event.eventType,
                                    imageUrl: event.imageUrl ?? "",
                                    location: event.location,
                                    eventDate: event.eventDate ?? "",
                                    username: event.username,
                                    email: event.email,
                                },
                            }}
                            actions={
                                <>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setViewEvent(event)
                                        }
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-2 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
                                    >
                                        <Eye size={14} />
                                        View
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditEvent(event)
                                        }
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 px-2 py-2.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
                                    >
                                        <Pencil size={14} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setDeleteId(event._id)
                                        }
                                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-rose-50 px-2 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </>
                            }
                        />
                    ))}
                </div>

            ) : (

                /* EMPTY STATE */
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">

                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
                        {events.length === 0 ? (
                            <CalendarDays size={35} />
                        ) : (
                            <Search size={35} />
                        )}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900">
                        {events.length === 0
                            ? 'No events created yet'
                            : 'No matching events'}
                    </h3>

                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                        {events.length === 0
                            ? 'Your community journey starts with one small action. Create your first event and inspire others to join.'
                            : 'Try another search term or select a different category.'}
                    </p>

                    {events.length === 0 ? (
                        <Link
                            href="/create-event"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                        >
                            <Plus size={18} />
                            Create Your First Event
                            <ArrowUpRight size={17} />
                        </Link>
                    ) : (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                            }}
                            className="mt-6 rounded-xl bg-gray-100 px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

        </div>

        {/* EVENT DETAILS MODAL */}
        {viewEvent && (
            <EventDetailsModal
                event={viewEvent}
                onClose={() => setViewEvent(null)}
                onEdit={() => {
                    setEditEvent(viewEvent);
                    setViewEvent(null);
                }}
                onDelete={() => {
                    setDeleteId(viewEvent._id);
                    setViewEvent(null);
                }}
            />
        )}

        {/* EDIT EVENT MODAL */}
        {editEvent && (
            <EditEventModal
                event={editEvent}
                onClose={() => setEditEvent(null)}
                onSave={handleUpdateEvent}
            />
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-sm">

                <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">

                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                        <Trash2 size={28} />
                    </div>

                    <h2 className="text-center text-2xl font-black text-gray-900">
                        Delete this event?
                    </h2>

                    <p className="mt-3 text-center text-sm leading-6 text-gray-500">
                        This action will permanently remove your
                        event. You cannot undo this action.
                    </p>

                    <div className="mt-8 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setDeleteId(null)}
                            disabled={deleting}
                            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {deleting ? (
                                <>
                                    <Loader2 size={17} className="animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 size={17} />
                                    Delete Event
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </main>
);
}