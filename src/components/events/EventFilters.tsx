"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import EventsCard from "./EventsCard";
import type { EventType } from "@/app/upcoming-events/page";

type Category = {
    name: string;
    icon: React.ReactNode;
    color: string;
};

type EventFiltersProps = {
    categories: Category[];
    events: EventType[];
};

export default function EventFilters({ categories, events }: EventFiltersProps) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [query, setQuery] = useState("");

    const filteredEvents = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return events.filter((event) => {
            const eventType = event.form?.eventType?.trim() || "";
            const matchesCategory =
                selectedCategory === "All" ||
                eventType.toLowerCase() === selectedCategory.toLowerCase();

            if (!matchesCategory) return false;
            if (!normalizedQuery) return true;

            const searchableText = [
                event.form?.title,
                event.form?.description,
                event.form?.location,
                eventType,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(normalizedQuery);
        });
    }, [events, query, selectedCategory]);

    return (
        <>
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
                            {categories.map((category) => {
                                const isSelected =
                                    selectedCategory === category.name;

                                return (
                                    <button
                                        key={category.name}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => setSelectedCategory(category.name)}
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
                                            focus-visible:outline-none
                                            focus-visible:ring-2
                                            focus-visible:ring-indigo-400
                                            ${
                                                isSelected
                                                    ? "scale-[1.02] shadow-md ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-slate-950"
                                                    : ""
                                            }
                                            ${category.color}
                                        `}
                                    >
                                        {category.icon}

                                        <span>{category.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

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
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
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
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                        <EventsCard key={event._id} event={event} />
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
        </>
    );
}
