import React from "react";
import {
    Calendar,
    PlusCircle,
    Search,
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

import EventsCard from "@/components/events/EventsCard";
import Link from "next/link";
import { connection } from "next/server";

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


                {/* FILTER */}

                <div
                    className="
                        mt-12
                        border-t
                        border-slate-200/60
                        pt-8
                        dark:border-slate-800
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-6
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        {/* CATEGORY */}

                        <div className="min-w-0 flex-1 overflow-hidden">

                            <div
                                className="
                                    flex
                                    gap-2.5
                                    overflow-x-auto
                                    pb-2
                                    scrollbar-thin
                                    scrollbar-thumb-slate-300
                                    scrollbar-track-transparent
                                    dark:scrollbar-thumb-slate-700
                                "
                            >

                                {categories.map(
                                    (category) => (
                                        <button
                                            key={
                                                category.name
                                            }
                                            type="button"
                                            className={`
                                                inline-flex
                                                shrink-0
                                                items-center
                                                gap-2
                                                whitespace-nowrap
                                                rounded-xl
                                                px-4
                                                py-2.5
                                                text-xs
                                                font-bold
                                                transition-all
                                                duration-200
                                                hover:scale-[1.02]
                                                hover:shadow-sm
                                                ${category.color}
                                            `}
                                        >
                                            {category.icon}

                                            <span>
                                                {
                                                    category.name
                                                }
                                            </span>
                                        </button>
                                    )
                                )}

                            </div>

                        </div>


                        {/* SEARCH */}

                        <div
                            className="
                                relative
                                w-full
                                max-w-sm
                                lg:w-80
                                lg:shrink-0
                            "
                        >

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-3.5
                                    text-slate-400
                                "
                            >
                                <Search size={18} />
                            </span>

                            <input
                                type="text"
                                placeholder="Search events or areas..."
                                className="
                                    w-full
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    py-3
                                    pl-11
                                    pr-4
                                    text-sm
                                    font-medium
                                    text-slate-800
                                    placeholder-slate-400
                                    outline-none
                                    transition-all
                                    duration-200
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    dark:border-slate-800
                                    dark:bg-slate-900
                                    dark:text-slate-100
                                    dark:focus:ring-indigo-950
                                "
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* EVENTS */}

            <div
                className="
                    mx-auto
                    mt-10
                    grid
                    max-w-7xl
                    gap-6
                    sm:grid-cols-2
                    lg:grid-cols-3
                "
            >

                {data.length > 0 ? (

                    data.map((event) => (
                        <EventsCard
                            key={event._id}
                            event={event}
                        />
                    ))

                ) : (

                    <div className="col-span-full py-20 text-center">

                        <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                            No upcoming events found.
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            Create an event and bring your
                            community together.
                        </p>

                    </div>

                )}

            </div>

        </main>
    );
}
