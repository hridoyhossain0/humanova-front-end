"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    CalendarDays,
    MapPin,
    ArrowRight,
    Loader2,
    HeartHandshake,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getSafeImageUrl } from "@/lib/eventImage";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { getApiUrl, fetchApiJson } from "@/lib/api";
import { toast } from "sonner";

interface JoinedEvent {
    _id: string;
    eventId?: string | { _id?: string };
    username: string;
    email: string;

    form?: {
        username?: string;
        email?: string;
        title?: string;
        description?: string;
        eventType?: string;
        imageUrl?: string;
        location?: string;
        eventDate?: string;
        createdAt?: string;
        _id?: string;
    };

    event?: {
        username?: string;
        email?: string;
        title?: string;
        description?: string;
        eventType?: string;
        imageUrl?: string;
        location?: string;
        eventDate?: string;
        createdAt?: string;
        _id?: string;
    };

    joiningDate?: string;
    registeringDate?: string;
}

const JoinedEventsPage = () => {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (sessionLoading) return;

        if (!session?.user) {
            return;
        }

        const fetchJoinedEvents = async () => {
            try {
                setLoading(true);
                setError("");

                const token = await getTokenFromClient();

                if (!token) {
                    throw new Error("Authentication token not found.");
                }

                const apiUrl = getApiUrl();

                const query = new URLSearchParams({
                    email: session.user.email,
                });

                const result = await fetchApiJson<{
                    success?: boolean;
                    message?: string;
                    data?: JoinedEvent[];
                    joined?: JoinedEvent[];
                    joinedEvents?: JoinedEvent[];
                }>(
                    `${apiUrl}/joined?${query}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Joined API:", result);

                // API can return an array or wrap it in a response object.
                const events: JoinedEvent[] = Array.isArray(result)
                    ? result
                    : Array.isArray(result.data)
                        ? result.data
                        : Array.isArray(result.joinedEvents)
                            ? result.joinedEvents
                        : [];

                // Older joined records use `event`; newer records use `form`.
                // Normalize both shapes before rendering, then keep only this
                // signed-in user's records as an extra client-side safeguard.
                const validEvents = events.filter(
                    (item) =>
                        item &&
                        (item.form || item.event) &&
                        item.email === session.user.email
                ).map((item) => ({
                    ...item,
                    form: item.form || item.event,
                    registeringDate:
                        item.registeringDate || item.joiningDate,
                }));

                setJoinedEvents(validEvents);
            } catch (error) {
                console.error("Joined Events Error:", error);

                const message =
                    error instanceof Error
                        ? error.message
                        : "Something went wrong.";

                setError(message);

                toast.error("Could not load joined events", {
                    description: message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchJoinedEvents();
    }, [session, sessionLoading]);

    // Loading
    if (sessionLoading || (loading && session?.user)) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                    <Loader2
                        size={25}
                        className="animate-spin"
                    />
                    Loading joined events...
                </div>
            </main>
        );
    }

    // Login required
    if (!session?.user) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 dark:bg-slate-950">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <HeartHandshake
                        size={45}
                        className="mx-auto text-indigo-600"
                    />

                    <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
                        Login Required
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Please login to see your joined events.
                    </p>

                    <Link
                        href="/sign-in"
                        className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                        Login Now
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                        <HeartHandshake size={14} />
                        My Community Activities
                    </div>

                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Joined Events
                    </h1>

                    <p className="mt-3 text-slate-500 dark:text-slate-400">
                        Events you have joined and plan to participate in.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!error && joinedEvents.length === 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                        <HeartHandshake
                            size={45}
                            className="mx-auto text-slate-400"
                        />

                        <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
                            No Joined Events
                        </h2>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            You haven&apos;t joined any events yet.
                        </p>

                        <Link
                            href="/upcoming-events"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                        >
                            Browse Events
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {/* Cards */}
                {joinedEvents.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {joinedEvents.map((joined) => {
                            const event = joined.form;
                            const eventId =
                                typeof joined.eventId === "string"
                                    ? joined.eventId
                                    : joined.eventId?._id;
                            const imageUrl = getSafeImageUrl(
                                event?.imageUrl
                            );

                            // Extra safety
                            if (!event) return null;

                            return (
                                <article
                                    key={joined._id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={
                                                    event.title ||
                                                    "Joined event"
                                                }
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                                No image available
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">

                                        {/* Type */}
                                        <span className="inline-flex rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                                            {event.eventType ||
                                                "Community Service"}
                                        </span>

                                        {/* Title */}
                                        <h2 className="mt-3 line-clamp-2 text-xl mb-auto font-bold text-slate-900 dark:text-white">
                                            {event.title ||
                                                "Untitled Event"}
                                        </h2>

                                        {/* Description */}
                                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                            {event.description ||
                                                "No description available."}
                                        </p>

                                        {/* Location */}
                                        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <MapPin
                                                size={16}
                                                className="shrink-0 text-indigo-500"
                                            />

                                            <span className="line-clamp-1">
                                                {event.location ||
                                                    "Location not specified"}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                            <CalendarDays
                                                size={16}
                                                className="shrink-0 text-indigo-500"
                                            />

                                            <span>
                                                {event.eventDate
                                                    ? new Date(
                                                        event.eventDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )
                                                    : "Date not specified"}
                                            </span>
                                        </div>

                                        {/* Joined */}
                                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                                            <span className="text-xs font-semibold text-emerald-600">
                                                ✓ Joined
                                            </span>

                                            <span className="text-xs text-slate-400">
                                                {joined.registeringDate
                                                    ? new Date(
                                                        joined.registeringDate
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : ""}
                                            </span>
                                        </div>

                                        {/* View Event */}
                                        <Link
                                            href={`/upcoming-events/${eventId || event._id || joined._id
                                                }`}
                                            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                                        >
                                            View Event
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
};

export default JoinedEventsPage;
