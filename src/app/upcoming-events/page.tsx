import React from "react";
import {
    Calendar,
    PlusCircle,
    Layers,
    Heart,
    Trash2,
    Sprout,
    GraduationCap,
    Droplets,
    Users,
    ShieldAlert,
    MoreHorizontal,
} from "lucide-react";

import EventFilters from "@/components/events/EventFilters";
import Link from "next/link";
import { connection } from "next/server";
import { isUpcomingEvent } from "@/lib/eventDate";

// This live API-driven page is allowed to wait for the server response.
export const instant = false;


// ========================================
// EVENT TYPE
// ========================================

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


// ========================================
// PAGE
// ========================================

export default async function UpcomingEventsPage() {
    // The event list is intentionally live. Wait for a request before the
    // uncached API call instead of trying to prerender it.
    await connection();

    const categories = [
        {
            name: "All",
            icon: <Layers size={15} />,
            color:
                "bg-indigo-600 text-white shadow-indigo-200",
        },
        {
            name: "Cleanup",
            icon: <Trash2 size={15} />,
            color:
                "bg-white text-amber-600 hover:bg-amber-50 border border-amber-100",
        },
        {
            name: "Plantation",
            icon: <Sprout size={15} />,
            color:
                "bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-100",
        },
        {
            name: "Donation",
            icon: <Heart size={15} />,
            color:
                "bg-white text-rose-600 hover:bg-rose-50 border border-rose-100",
        },
        {
            name: "Education",
            icon: <GraduationCap size={15} />,
            color:
                "bg-white text-violet-600 hover:bg-violet-50 border border-violet-100",
        },
        {
            name: "Blood Donation",
            icon: <Droplets size={15} />,
            color:
                "bg-white text-red-600 hover:bg-red-50 border border-red-100",
        },
        {
            name: "Community Service",
            icon: <Users size={15} />,
            color:
                "bg-white text-blue-600 hover:bg-blue-50 border border-blue-100",
        },
        {
            name: "Disaster Relief",
            icon: <ShieldAlert size={15} />,
            color:
                "bg-white text-orange-600 hover:bg-orange-50 border border-orange-100",
        },
        {
            name: "Other",
            icon: <MoreHorizontal size={15} />,
            color:
                "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200",
        },
    ];

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error(
            "NEXT_PUBLIC_API_URL is not configured"
        );
    }

    const res = await fetch(
        `${apiUrl}/events`,
        {
            // A newly created event must be visible as soon as the create
            // flow returns to this page, so do not reuse a cached list.
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error(
            `Failed to fetch events. Status: ${res.status}`
        );
    }

    const data: EventType[] = await res.json();

    // Events whose date has already passed are not shown here.
    const upcomingEvents = data.filter((event) =>
        isUpcomingEvent(event.form?.eventDate)
    );

    return (
        <main className="w-full bg-slate-50/50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-7xl">

                {/* HEADER */}

                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

                    <div className="max-w-2xl">

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-xl
                                bg-indigo-50
                                px-3.5
                                py-1.5
                                text-xs
                                font-bold
                                tracking-wide
                                text-indigo-600
                                dark:bg-indigo-950/50
                                dark:text-indigo-400
                            "
                        >
                            <Calendar
                                size={14}
                                className="animate-pulse"
                            />

                            <span>
                                Make an Impact Together
                            </span>
                        </div>

                        <h1
                            className="
                                mt-4
                                text-4xl
                                font-extrabold
                                tracking-tight
                                text-slate-900
                                dark:text-slate-50
                                sm:text-5xl
                            "
                        >
                            Upcoming Events
                        </h1>

                        <p
                            className="
                                mt-3
                                text-base
                                leading-relaxed
                                text-slate-500
                                dark:text-slate-400
                            "
                        >
                            Find meaningful community activities happening
                            soon. Choose a cause that matters to you,
                            discover local opportunities, and join others
                            who are ready to make a positive difference.
                        </p>

                    </div>


                    {/* CREATE EVENT */}

                    <Link
                        href="/create-event"
                        className="
                            inline-flex
                            shrink-0
                            items-center
                            justify-center
                            gap-2.5
                            rounded-2xl
                            bg-slate-900
                            px-6
                            py-3.5
                            text-sm
                            font-bold
                            text-white
                            shadow-lg
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-indigo-600
                            hover:shadow-indigo-200
                            dark:bg-indigo-600
                            dark:hover:bg-indigo-500
                        "
                    >
                        <PlusCircle size={18} />
                        <span>Create Event</span>
                    </Link>

                </div>


                <EventFilters categories={categories} events={upcomingEvents} />
            </div>

        </main>
    );
}
