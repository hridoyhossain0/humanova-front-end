"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Globe2,
    Mail,
    UserRound,
    HeartHandshake,
    Clock3,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

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

    const [joining, setJoining] = useState(false);
    const [joined, setJoined] = useState(false);
    const [error, setError] = useState("");

    const form = event.form;

    const { date, time } = formatEventDate(form.eventDate);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const user = session?.user;

    const eventType =
        form.eventType || "Community Service";

    const creatorName =
        form.username || "Community Organizer";

    const creatorEmail =
        form.email || "Organizer contact unavailable";

    const imageUrl =
        form.imageUrl ||
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80";

    const handleJoin = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            if (!user) {
                alert("Please login first.");
                return;
            }

            const token = await getTokenFromClient();

            if (!token) {
                alert("Authentication token not found.");
                return;
            }

            const data = {
                username: user.name,
                email: user.email,
                image: user.image,
                eventId: event._id,
                event: event.form,
                joiningDate: new Date(),
            };

            const res = await fetch(`${apiUrl}/joined`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify(data),
            });

            const result = await res.json();

            console.log("Join response:", result);

            if (!res.ok) {
                throw new Error(
                    result.message ||
                    `Failed to join event. Status: ${res.status}`
                );
            }

            alert("Successfully joined the event!");

        } catch (error) {
            console.error("Join Event Error:", error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
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
                                    disabled={joining || joined}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <HeartHandshake size={18} />

                                    {joining
                                        ? "Joining..."
                                        : joined
                                            ? "Joined Successfully"
                                            : "Join Event"}
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

                                    {form.image ? (
                                        <Image
                                            src={form.image}
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