
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    CalendarDays,
    MapPin,
    Globe,
    Users,
    Mail,
    ArrowLeft,
    Heart,
    Clock,
} from 'lucide-react';
import Image from 'next/image';
import { getSafeImageUrl } from '@/lib/eventImage';
import { getTokenFromServer } from '@/lib/getTokenFromServer';
import { getApiUrl } from '@/lib/api';

export const instant = false;

interface Event {
    _id: string;
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: string;
    registeredCount?: number;
    price?: number;
    createdByEmail?: string;
    categories?: string[];
    endDate?: string;
}

async function getEvent(id: string): Promise<Event | null> {
    const API_URL = getApiUrl();
    const token = await getTokenFromServer();

    const res = await fetch(
        `${API_URL}/joined-events/${id}`,{
        headers: token
            ? {
                authorization: `Bearer ${token}`,
            }
            : {},
        
});

    if (res.status === 404) return null;

    if (!res.ok) {
        throw new Error('Failed to fetch event.');
    }

    const result = await res.json();

    return result.event ?? result;
}

export default async function JoinedEventDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const event = await getEvent(id);

    if (!event) notFound();

    const eventDate = new Date(event.eventDate);
    const hasValidDate = !Number.isNaN(eventDate.getTime());
    const endDate = event.endDate ? new Date(event.endDate) : null;

    const date = hasValidDate
        ? new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(eventDate)
        : 'Date not available';

    const time = hasValidDate
        ? new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(eventDate)
        : '';

    const endTime =
        endDate && !Number.isNaN(endDate.getTime())
            ? new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            }).format(endDate)
            : null;

    const categories = event.categories?.length
        ? event.categories
        : [event.eventType].filter(Boolean);

    const imageUrl =
        getSafeImageUrl(event.imageUrl) ||
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80';

    return (
        <main className="min-h-screen bg-white dark:bg-gray-950">

            {/* Back Navigation */}
            <div className="mx-auto max-w-7xl px-5 pt-8">
                <Link
                    href="/upcoming-events"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={17} />
                    Back to events
                </Link>
            </div>

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-8 lg:grid-cols-[380px_1fr] lg:gap-10">

                {/* LEFT SIDE */}
                <aside className="space-y-5">

                    {/* Event Image */}
                    <div className="overflow-hidden rounded-2xl">
                        <Image
                            height={50}
                            width={50}
                            src={imageUrl}
                            alt={event.title}
                            className="h-[300px] w-full object-cover sm:h-[380px]"
                        />
                    </div>

                    {/* Registration Card */}
                    <div
                        id="registration"
                        className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
                    >
                        <p className="mb-4 text-sm font-medium text-gray-800 dark:text-gray-200">
                            Join this event and make a difference!
                        </p>

                        <Link
                            href="/sign-in"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Register now
                            <Heart size={17} />
                        </Link>

                        <p className="mt-3 text-center text-xs text-gray-400">
                            Login required to register for this event.
                        </p>
                    </div>

                    {/* Registered People */}
                    <div className="rounded-2xl py-2">
                        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                            Going ({event.registeredCount ?? 0})
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                                <Users size={19} />
                            </div>
                            <span>
                                {event.registeredCount ?? 0} people registered
                            </span>
                        </div>
                    </div>

                </aside>

                {/* RIGHT SIDE */}
                <section>

                    {/* Title */}
                    <div className="mb-6">
                        <div className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                            {event.eventType}
                        </div>

                        <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-4xl">
                            {event.title}
                        </h1>
                    </div>

                    {/* Event Information */}
                    <div className="mb-6 space-y-4">

                        {/* Date */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <CalendarDays size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {date}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {time}
                                    {endTime ? ` – ${endTime}` : ''}
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <MapPin size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Location
                                </p>
                                <p className="text-xs text-gray-500">
                                    {event.location}
                                </p>
                            </div>
                        </div>

                        {/* Visibility */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Globe size={19} />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Public
                                </p>
                                <p className="text-xs text-gray-500">
                                    Anyone can see this event.
                                </p>
                            </div>
                        </div>

                    </div>

                    <hr className="border-gray-200 dark:border-gray-800" />

                    {/* Description */}
                    <div className="py-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                            About this event
                        </h2>

                        <p className="whitespace-pre-line text-sm leading-7 text-gray-600 dark:text-gray-400">
                            {event.description}
                        </p>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-800" />

                    {/* Categories */}
                    <div className="py-6">
                        <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                            Categories
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <span
                                    key={category}
                                    className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 dark:bg-blue-950 dark:text-blue-300"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-800" />

                    {/* Host Information */}
                    <div className="py-6">
                        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                            Hosted by
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                <Mail size={20} />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Event Organizer
                                </p>

                                <p className="text-xs text-gray-500">
                                    {event.createdByEmail ?? 'Community Organizer'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-900">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Clock size={17} />
                            Event Entry Fee
                        </div>

                        <span className="font-bold text-blue-600">
                            {event.price
                                ? `Rp ${new Intl.NumberFormat('id-ID').format(event.price)}`
                                : 'Free'}
                        </span>
                    </div>

                </section>
            </div>
        </main>
    );
}
