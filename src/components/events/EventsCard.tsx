"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, MapPin } from "lucide-react";

import type { EventType } from "@/app/upcoming-events/page";
import { getSafeImageUrl } from "@/lib/eventImage";
import { useJoinedEvents } from "@/components/providers/JoinedEventsProvider";

interface EventsCardProps {
    event: EventType;
    actions?: React.ReactNode;
}

// ========================================
// SAFE DATE FORMATTER
// ========================================

function formatDate(dateValue?: string) {
    if (!dateValue) {
        return "Date not available";
    }

    const date = new Date(
        dateValue.length === 10 ? `${dateValue}T00:00:00` : dateValue
    );

    if (Number.isNaN(date.getTime())) {
        return "Date not available";
    }

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);
}

// ========================================
// EVENTS CARD
// ========================================

const EventsCard = ({ event, actions }: EventsCardProps) => {
    const { isJoined } = useJoinedEvents();

    const form = event?.form;

    if (!form) {
        return null;
    }

    const joined = isJoined(event._id);
    const eventDate = formatDate(form.eventDate);
    const imageUrl = getSafeImageUrl(form.imageUrl);

    const card = (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {/* IMAGE */}
            <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={form.title || "Community event"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                        No image available
                    </div>
                )}

                {joined && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/20">
                        <Check size={13} />
                        Joined
                    </span>
                )}
            </div>

            {/* CONTENT */}
            <div className="p-5">
                {/* TYPE */}
                <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    {form.eventType || "Community Service"}
                </span>

                {/* TITLE */}
                <h2 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900 dark:text-white">
                    {form.title || "Untitled Event"}
                </h2>

                {/* DESCRIPTION */}
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {form.description || "No description available."}
                </p>

                {/* LOCATION */}
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin
                        size={16}
                        className="shrink-0 text-indigo-500"
                    />
                    <span className="line-clamp-1">
                        {form.location || "Location not available"}
                    </span>
                </div>

                {/* DATE */}
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarDays
                        size={16}
                        className="shrink-0 text-indigo-500"
                    />
                    <span>{eventDate}</span>
                </div>

                {actions && (
                    <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        {actions}
                    </div>
                )}
            </div>
        </article>
    );

    if (actions) {
        return card;
    }

    return (
        <Link
            href={`/upcoming-events/${event._id}`}
            className="block"
        >
            {card}
        </Link>
    );
};

export default EventsCard;
