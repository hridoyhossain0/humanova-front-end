
'use client';

import Link from 'next/link';
import {
    ArrowUpRight,
    CalendarDays,
    MapPin,
    Users,
    Pencil,
    Trash2,
    Heart,
} from 'lucide-react';

export interface Event {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: string;
    createdByEmail: string;
    registeredCount?: number;
}

interface EventCardProps {
    event: Event;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

const EventCard = ({
    event,
    onDelete,
    showActions = false,
}: EventCardProps) => {
    const date = new Date(event.eventDate);

    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    const formattedYear = date.getFullYear();

    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });

    const organizer = event.createdByEmail?.split('@')[0] || 'Community Organizer';

    return (
        <article className="group relative overflow-hidden rounded-[24px] border border-[#282743] bg-[#17172d] shadow-lg shadow-indigo-950/10 transition-all duration-300 hover:-translate-y-2 hover:border-violet-500/60 hover:shadow-2xl hover:shadow-violet-950/20">

            {/* IMAGE SECTION */}
            <div className="relative h-[225px] overflow-hidden">

                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#17172d] via-black/10 to-black/20" />

                {/* Category */}
                <div className="absolute left-5 top-5">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-[#17172d]/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-violet-200 backdrop-blur-md">
                        {event.eventType}
                    </span>
                </div>

                {/* Favorite Icon */}
                <button
                    type="button"
                    aria-label="Save event"
                    className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-rose-500"
                >
                    <Heart size={18} />
                </button>

                {/* Date Badge */}
                <div className="absolute bottom-4 left-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#17172d]/90 p-3 backdrop-blur-md">
                    <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-violet-500 text-white">
                        <span className="text-[10px] font-bold uppercase">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black leading-none">
                            {date.getDate()}
                        </span>
                    </div>

                    <div>
                        <p className="text-sm font-bold text-white">
                            {formattedDate}, {formattedYear}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            {formattedTime}
                        </p>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTION */}
            <div className="p-5 sm:p-6">

                {/* Title */}
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-extrabold leading-tight text-white transition-colors group-hover:text-violet-300">
                        {event.title}
                    </h2>

                    <ArrowUpRight
                        size={21}
                        className="mt-1 shrink-0 text-violet-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                </div>

                {/* Location */}
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={16} className="shrink-0 text-violet-400" />
                    <span className="truncate">{event.location}</span>
                </div>

                {/* Description */}
                <p className="mb-5 min-h-[48px] text-sm leading-6 text-gray-400">
                    {event.description.length > 105
                        ? `${event.description.slice(0, 105)}...`
                        : event.description}
                </p>

                {/* Organizer Info */}
                <div className="mb-5 flex items-center justify-between border-y border-white/10 py-4">

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                            <Users size={17} />
                        </div>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                Organized by
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-200">
                                {organizer}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                        <Users size={14} />
                        {event.registeredCount ?? 0} Joined
                    </div>
                </div>

                {/* ACTIONS */}
                {showActions ? (
                    <div className="grid grid-cols-[1fr_auto_auto] gap-2">

                        <Link
                            href={`/events/${event._id}`}
                            className="flex items-center justify-center gap-2 rounded-xl bg-violet-500 px-3 py-3 text-sm font-bold text-white transition hover:bg-violet-600"
                        >
                            View Event
                            <ArrowUpRight size={16} />
                        </Link>

                        <Link
                            href={`/dashboard/events/${event._id}/edit`}
                            aria-label="Edit event"
                            className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-violet-300 transition hover:bg-violet-500/20"
                        >
                            <Pencil size={17} />
                        </Link>

                        <button
                            type="button"
                            onClick={() => onDelete?.(event._id)}
                            aria-label="Delete event"
                            className="flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 text-rose-400 transition hover:bg-rose-500 hover:text-white"
                        >
                            <Trash2 size={17} />
                        </button>
                    </div>
                ) : (
                    <Link
                        href={`/events/${event._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/30 bg-violet-500/10 py-3 text-sm font-bold text-violet-300 transition hover:bg-violet-500 hover:text-white"
                    >
                        Explore Event
                        <ArrowUpRight size={17} />
                    </Link>
                )}
            </div>
        </article>
    );
};

export default EventCard;


// ========================================
// EVENT GRID - RENDER EVENTS USING MAP()
// ========================================

interface EventGridProps {
    events: Event[];
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export const EventGrid = ({
    events,
    onDelete,
    showActions = false,
}: EventGridProps) => {

    if (!events || events.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                    <CalendarDays size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">
                    No events found
                </h3>

                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                    There are no events to display right now.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
                <EventCard
                    key={event._id}
                    event={event}
                    onDelete={onDelete}
                    showActions={showActions}
                />
            ))}
        </div>
    );
};
