import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import EventDetails, {
    EventType,
} from "@/components/events/EventDetails";

import { getTokenFromServer } from "@/lib/getTokenFromServer";


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

    const { id } = await params;

    const token =
        await getTokenFromServer();

    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
        throw new Error(
            "NEXT_PUBLIC_API_URL is not configured"
        );
    }


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
                    bg-slate-50
                    px-6
                    dark:bg-slate-950
                "
            >

                <div
                    className="
                        w-full
                        max-w-md
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-8
                        text-center
                        shadow-sm
                        dark:border-slate-800
                        dark:bg-slate-900
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                            dark:text-white
                        "
                    >
                        Event Not Found
                    </h1>

                    <p
                        className="
                            mt-2
                            text-sm
                            text-slate-500
                            dark:text-slate-400
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

    const event: EventType =
        await res.json();


    return (
        <EventDetails
            event={event}
        />
    );
}