import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { connection } from "next/server";

import EventDetails, {
    EventType,
} from "@/components/events/EventDetails";

import { getTokenFromServer } from "@/lib/getTokenFromServer";
import { getApiUrl } from "@/lib/api";

// This live API-driven page is allowed to wait for the server response.
export const instant = false;


// ========================================
// PARAMS
// ========================================

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}


// ========================================
// PAGE
// ========================================

export default async function EventDetailsPage({
    params,
}: PageProps) {

    // This page reads a live event from the API, so render it per request.
    await connection();

    const { id } = await params;

    const token =
        await getTokenFromServer();

    const apiUrl = getApiUrl();


    // ========================================
    // FETCH EVENT
    // ========================================

    const res = await fetch(
        `${apiUrl}/events/${encodeURIComponent(id)}`,
        {
            headers: token
                ? {
                    authorization:
                        `Bearer ${token}`,
                }
                : {},
            cache: "no-store",
        }
    );


    // ========================================
    // NOT FOUND
    // ========================================

    if (res.status === 404) {

        return (
            <main
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-slate-50 dark:bg-slate-950
                    px-6
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-slate-200 dark:border-slate-800
                        bg-white dark:bg-slate-900
                        p-8
                        text-center
                        shadow-sm
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-900 dark:text-slate-100
                        "
                    >
                        Event Not Found
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500 dark:text-slate-400
                        "
                    >
                        The event you are looking for
                        does not exist or has already
                        been removed.
                    </p>

                    <Link
                        href="/upcoming-events"
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-indigo-600
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                            transition
                            hover:bg-indigo-700
                        "
                    >
                        <ArrowLeft size={16} />
                        Back to Events
                    </Link>

                </div>

            </main>
        );
    }


    // ========================================
    // OTHER ERROR
    // ========================================

    if (!res.ok) {
        throw new Error(
            `Failed to fetch event. Status: ${res.status}`
        );
    }


    // ========================================
    // RESPONSE
    // ========================================

    // Some API error paths return a successful status with an empty body.
    // Avoid parsing an empty response and show the existing not-found route.
    const responseText = await res.text();

    if (!responseText.trim()) {
        notFound();
    }

    let event: EventType;

    try {
        event = JSON.parse(responseText) as EventType;
    } catch {
        notFound();
    }


    return (
        <EventDetails
            event={event}
        />
    );
}
