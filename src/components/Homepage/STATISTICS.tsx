"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    SlidersHorizontal,
    PartyPopper,
} from "lucide-react";

type EventDetails = {
    eventDate?: string;
    eventType?: string;
};

type EventRecord = EventDetails & {
    form?: EventDetails;
};

type StatisticsProps = {
    events?: EventRecord[];
};

const STATISTICS = ({ events = [] }: StatisticsProps) => {
    // Events created by this app store their display data inside `form`.
    // Supporting both shapes keeps these counts usable across all event lists.
    const eventDetails = events.map((event) => event.form ?? event);
    const [currentTime, setCurrentTime] = useState<number | null>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setCurrentTime(Date.now());
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const upcomingEvents = eventDetails.filter((event) => {
        if (!event.eventDate) return false;

        const eventDate = new Date(event.eventDate);
        return (
            !Number.isNaN(eventDate.getTime()) &&
            (currentTime === null || eventDate.getTime() >= currentTime)
        );
    });

    const categoryCount = new Set(
        eventDetails
            .map((event) => event.eventType?.trim())
            .filter((eventType): eventType is string => Boolean(eventType))
    ).size;

    return (
        <div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Events
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-gray-900">
                                {eventDetails.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
                            <CalendarDays size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Upcoming Events
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-emerald-600">
                                {upcomingEvents.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-600">
                            <PartyPopper size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Categories
                            </p>
                            <h2 className="mt-2 text-3xl font-black text-orange-500">
                                {categoryCount}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <SlidersHorizontal size={24} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default STATISTICS;
