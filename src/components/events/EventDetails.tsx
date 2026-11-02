"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Globe2,
    Mail,
    UserRound,
    HeartHandshake,
    Check,
    Clock3,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getSafeImageUrl } from "@/lib/eventImage";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import { useJoinedEvents } from "@/components/providers/JoinedEventsProvider";
import { toast } from "sonner";

export interface EventType {
    _id: string;

    form: {
        title: string;
        description: string;
        eventType: string;
        imageUrl: string;
        location: string;
        eventDate: string;
        username?: string;
        email?: string;
        image?: string | null;
        createdAt?: string;
    };
}

type Participant = {
    _id: string;
    username?: string;
    image?: string | null;
};

function getInitials(name?: string) {
    const parts = (name || "Guest")
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) return "G";
    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getParticipantSummary(participants: Participant[]) {
    const names = participants.map(
        (participant) => participant.username || "Guest"
    );

    if (names.length === 0) return "";
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} and ${names[1]}`;

    return `${names[0]}, ${names[1]}, and ${names.length - 2} more`;
}

function formatEventDate(dateString: string) {
    if (!dateString) {
        return {
            date: "Date not available",
            time: "",
        };
    }

    const date = new Date(
        dateString.length === 10
            ? `${dateString}T00:00:00`
            : dateString
    );

    if (Number.isNaN(date.getTime())) {
        return {
            date: "Date not available",
            time: "",
        };
    }

    return {
        date: new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date),

        time:
            dateString.length === 10
                ? "Time not specified"
                : new Intl.DateTimeFormat("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                }).format(date),
    };
}

export default function EventDetails({
    event,
}: {
    event: EventType;
}) {
    const { data: session } = authClient.useSession();

    const {
        isJoined,
        markJoined,
        markLeft,
        loading: joinedLoading,
    } = useJoinedEvents();

    const [joining, setJoining] = useState(false);
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [registeredCount, setRegisteredCount] = useState(0);
    const [participantsLoading, setParticipantsLoading] = useState(true);

    const joined = isJoined(event._id);

    const form = event.form;

    const { date, time } = formatEventDate(form.eventDate);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const refreshParticipants = useCallback(async () => {
        if (!apiUrl) {
            setParticipantsLoading(false);
            return;
        }

        setParticipantsLoading(true);

        try {
            const res = await fetch(
                `${apiUrl}/events/${encodeURIComponent(event._id)}/participants`,
                { cache: "no-store" }
            );

            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    result?.message || "Failed to load participants."
                );
            }

            const list: Participant[] = Array.isArray(
                result.participants
            )
                ? result.participants
                : [];

            setParticipants(list);
            setRegisteredCount(
                typeof result.registeredCount === "number"
                    ? result.registeredCount
                    : list.length
            );
        } catch (participantsError) {
            console.error(
                "Participants fetch failed:",
                participantsError
            );
        } finally {
            setParticipantsLoading(false);
        }
    }, [apiUrl, event._id]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void refreshParticipants();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [refreshParticipants]);

    const user = session?.user;

    const eventType =
        form.eventType || "Community Service";

    const creatorName =
        form.username || "Community Organizer";

    const creatorEmail =
        form.email || "Organizer contact unavailable";

    const imageUrl =
        getSafeImageUrl(form.imageUrl) ||
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80";

    const organizerImage = getSafeImageUrl(form.image);

    const handleJoin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (joining) return;

        if (!user) {
            toast.error("Please sign in", {
                description:
                    "You need an account to join this event.",
            });
            return;
        }

        setJoining(true);
        setError("");

        const toastId = toast.loading(
            joined
                ? "Removing your registration..."
                : "Joining event...",
            {
                description: joined
                    ? "Updating your joined events."
                    : form.title || "Reserving your spot.",
            }
        );

        try {
            const token = await getTokenFromClient();

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please sign in again."
                );
            }

            const res = joined
                ? await fetch(`${apiUrl}/joined/${event._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        eventId: event._id,
                        email: user.email,
                    }),
                })
                : await fetch(`${apiUrl}/joined`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        username: user.name,
                        email: user.email,
                        image: user.image,
                        eventId: event._id,
                        // Keep `event` for the existing API schema while also sending
                        // the display shape used by the joined-events page.
                        event: event.form,
                        form: event.form,
                        registeringDate: new Date().toISOString(),
                    }),
                });

            const result = await res.json().catch(() => ({}));

            if (!res.ok) {
                throw new Error(
                    result.message ||
                    `Failed to ${joined ? "remove" : "join"} event. Status: ${res.status}`
                );
            }

            if (joined) {
                markLeft(event._id);
            } else {
                markJoined(event._id);
            }

            void refreshParticipants();

            const alreadyJoined = Boolean(result?.alreadyJoined);

            toast.success(
                joined
                    ? "Left event"
                    : alreadyJoined
                        ? "Already joined"
                        : "Joined event!",
                {
                    id: toastId,
                    description: joined
                        ? `You are no longer registered for "${form.title}".`
                        : alreadyJoined
                            ? `You are already registered for "${form.title}".`
                            : `You are registered for "${form.title}".`,
                }
            );

        } catch (error) {
            console.error("Join Event Error:", error);

            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong.";

            setError(message);

            toast.error(
                joined ? "Could not leave event" : "Could not join event",
                {
                    id: toastId,
                    description: message,
                }
            );
        } finally {
            setJoining(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">

            <div className="mx-auto mb-6 max-w-6xl">
                <Link
                    href="/upcoming-events"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-400"
                >
                    <ArrowLeft size={17} />
                    Back to Upcoming Events
                </Link>
            </div>

            <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <div className="grid lg:grid-cols-[380px_1fr]">

                    {/* LEFT */}
                    <div className="border-b border-slate-200 p-5 dark:border-slate-800 lg:border-b-0 lg:border-r lg:p-6">

                        <div className="relative h-[300px] w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[350px] lg:h-[380px]">
                            <Image
                                src={imageUrl}
                                alt={form.title || "Event image"}
                                fill
                                sizes="(max-width: 1024px) 100vw, 380px"
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* JOIN */}
                        <div className="mt-5 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">

                            <p className="mb-3 text-sm font-bold text-slate-800 dark:text-white">
                                Want to join this event?
                            </p>

                            <form onSubmit={handleJoin}>
                                <button
                                    type="submit"
                                    disabled={joining || joinedLoading}
                                    aria-pressed={joined}
                                    className="flex w-full items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <HeartHandshake size={18} />

                                    <span className="flex-1 text-center">
                                        {joining
                                            ? joined
                                                ? "Removing..."
                                                : "Joining..."
                                            : joinedLoading
                                                ? "Checking..."
                                                : joined
                                                    ? "Joined Event"
                                                    : "Join Event"}
                                    </span>

                                    {joined && <Check size={18} />}
                                </button>
                            </form>

                            {error && (
                                <p className="mt-3 text-sm text-red-500">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* EVENT TYPE */}
                        <div className="mt-5">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Event Type
                            </p>

                            <span className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                <HeartHandshake size={14} />
                                {eventType}
                            </span>
                        </div>

                        {/* GOING */}
                        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-700">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    Going ({registeredCount})
                                </p>

                                {!participantsLoading &&
                                    participants.length === 0 && (
                                        <span className="text-xs font-medium text-slate-400">
                                            Be the first to join
                                        </span>
                                    )}
                            </div>

                            {participantsLoading ? (
                                <div className="mt-4 flex -space-x-2">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div
                                            key={item}
                                            className="h-11 w-11 animate-pulse rounded-full bg-slate-200 ring-2 ring-white dark:bg-slate-800 dark:ring-slate-900"
                                        />
                                    ))}
                                </div>
                            ) : participants.length > 0 ? (
                                <>
                                    <div className="mt-4 flex -space-x-2 overflow-x-auto pb-1">
                                        {participants.map(
                                            (participant) => (
                                                <div
                                                    key={participant._id}
                                                    title={
                                                        participant.username ||
                                                        "Guest"
                                                    }
                                                    className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-600 ring-2 ring-white dark:bg-blue-950/50 dark:text-blue-300 dark:ring-slate-900"
                                                >
                                                    {participant.image ? (
                                                        <Image
                                                            src={
                                                                participant.image
                                                            }
                                                            alt={
                                                                participant.username ||
                                                                "Event participant"
                                                            }
                                                            fill
                                                            sizes="44px"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span>
                                                            {getInitials(
                                                                participant.username
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                        {getParticipantSummary(
                                            participants
                                        )}
                                    </p>
                                </>
                            ) : (
                                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                    No one has joined yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="p-5 sm:p-7 lg:p-10">

                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                <HeartHandshake size={14} />
                                Community Event
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
                                {form.title}
                            </h1>
                        </div>

                        {/* INFORMATION */}
                        <div className="mt-7 grid gap-3 sm:grid-cols-2">

                            <InfoItem
                                icon={<CalendarDays size={20} />}
                                label="Date"
                                value={date}
                            />

                            <InfoItem
                                icon={<Clock3 size={20} />}
                                label="Time"
                                value={time}
                            />

                            <div className="sm:col-span-2">
                                <InfoItem
                                    icon={<MapPin size={20} />}
                                    label="Location"
                                    value={form.location}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InfoItem
                                    icon={<Globe2 size={20} />}
                                    label="Visibility"
                                    value="Public"
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <section className="mt-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                About this event
                            </h2>

                            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-300">
                                {form.description}
                            </p>
                        </section>

                        {/* CATEGORY */}
                        <section className="mt-8">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Category
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                    {eventType}
                                </span>

                                <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    Community
                                </span>
                            </div>
                        </section>

                        {/* HOST */}
                        <section className="mt-8 border-t border-slate-200 pt-7 dark:border-slate-800">

                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                Hosted by
                            </h2>

                            <div className="mt-4 flex items-center gap-4">

                                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-indigo-100 dark:bg-indigo-950">

                                    {organizerImage ? (
                                        <Image
                                            src={organizerImage}
                                            alt={creatorName}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-indigo-600">
                                            <UserRound size={22} />
                                        </div>
                                    )}

                                </div>

                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {creatorName}
                                    </p>

                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <Mail size={13} />
                                        {creatorEmail}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* CONTACT */}
                        <div className="mt-6">
                            <a
                                href={`mailto:${creatorEmail}`}
                                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                            >
                                <Mail size={16} />
                                Contact organizer
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-900">
                {icon}
            </div>

            <div>
                <p className="text-xs font-medium text-slate-400">
                    {label}
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}
