'use client';

import Image from 'next/image';
import {
    CalendarDays,
    Mail,
    MapPin,
    Pencil,
    Trash2,
    UserRound,
    X,
} from 'lucide-react';

export interface ManageEventDetails {
    _id: string;
    title: string;
    location: string;
    description: string;
    eventType: string;
    imageUrl?: string;
    eventDate?: string;
    username?: string;
    email?: string;
}

interface EventDetailsModalProps {
    event: ManageEventDetails;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function formatDate(dateValue?: string) {
    if (!dateValue) return 'Date not available';

    const date = new Date(
        dateValue.length === 10
            ? `${dateValue}T00:00:00`
            : dateValue
    );

    if (Number.isNaN(date.getTime())) return 'Date not available';

    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
}

export default function EventDetailsModal({
    event,
    onClose,
    onEdit,
    onDelete,
}: EventDetailsModalProps) {
    const imageUrl = event.imageUrl;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/60 p-4 backdrop-blur-sm sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-label={`${event.title} details`}
            onClick={onClose}
        >
            <div
                className="my-6 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header image */}
                <div className="relative h-52 w-full bg-gray-100 sm:h-60">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={event.title || 'Event image'}
                            fill
                            sizes="(max-width: 672px) 100vw, 672px"
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No image available
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close details"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white"
                    >
                        <X size={19} />
                    </button>

                    <span className="absolute bottom-4 left-4 inline-flex rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                        {event.eventType || 'Community Service'}
                    </span>
                </div>

                <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                        {event.title || 'Untitled Event'}
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                <CalendarDays size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-400">
                                    Date
                                </p>
                                <p className="mt-0.5 text-sm font-bold text-gray-800">
                                    {formatDate(event.eventDate)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                <MapPin size={19} />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-400">
                                    Location
                                </p>
                                <p className="mt-0.5 line-clamp-1 text-sm font-bold text-gray-800">
                                    {event.location || 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <section className="mt-6">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-gray-400">
                            About this event
                        </h3>
                        <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                            {event.description || 'No description provided.'}
                        </p>
                    </section>

                    {(event.username || event.email) && (
                        <section className="mt-6 border-t border-gray-100 pt-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                    <UserRound size={20} />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {event.username || 'Event Organizer'}
                                    </p>

                                    {event.email && (
                                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                                            <Mail size={12} />
                                            {event.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="mt-7 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-100 sm:flex-1"
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 sm:flex-1"
                        >
                            <Pencil size={16} />
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 sm:flex-1"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
