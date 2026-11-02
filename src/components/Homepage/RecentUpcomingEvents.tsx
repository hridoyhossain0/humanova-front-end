import Link from "next/link";
import {
    ArrowUpRight,
    MapPin,
    CalendarDays,
    HeartHandshake,
    Leaf,
    Trash2,
    GraduationCap,
    Droplets,
    HandHeart,
    UsersRound,
} from "lucide-react";

type EventForm = {
    title: string;
    description: string;
    eventType: string;
    imageUrl: string;
    location: string;
    eventDate: string;
};

type ApiEvent = {
    _id: string;
    form: EventForm;
};

function getCategoryIcon(type: string) {
    switch (type?.toLowerCase()) {
        case "cleanup":
            return Trash2;
        case "plantation":
            return Leaf;
        case "education":
            return GraduationCap;
        case "blood donation":
            return Droplets;
        case "donation":
            return HeartHandshake;
        default:
            return HandHeart;
    }
}

function formatDate(date: string) {
    if (!date) return "Date to be announced";

    // Avoid timezone shifting for YYYY-MM-DD dates.
    const [year, month, day] = date.split("-").map(Number);

    const parsedDate =
        year && month && day
            ? new Date(year, month - 1, day)
            : new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return new Intl.DateTimeFormat("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(parsedDate);
}

async function getUpcomingEvents(): Promise<ApiEvent[]> {
    const apiUrl = (
        process.env.NEXT_PUBLIC_API_URL ||
        process.env.API_URL ||
        ""
    ).replace(/\/+$/, "");

    if (!apiUrl) {
        console.error("API URL is missing.");
        return [];
    }

    try {
        const response = await fetch(
            `${apiUrl}/events/upcoming`,
            {
                next: { revalidate: 60 },
            }
        );

        if (!response.ok) {
            console.error(
                "Failed to fetch upcoming events:",
                response.status
            );
            return [];
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) return [];

        return data.filter(
            (event): event is ApiEvent =>
                Boolean(
                    event &&
                    typeof event === "object" &&
                    "_id" in event &&
                    "form" in event &&
                    event.form &&
                    typeof event.form === "object"
                )
        );
    } catch (error) {
        console.error("Upcoming events fetch failed:", error);
        return [];
    }
}

const RecentUpcomingEvents = async () => {
    const events = await getUpcomingEvents();

    return (
        <section className="relative overflow-hidden bg-[#F8F8F5] py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-5 md:px-10">

                {/* Header */}
                <div className="mb-12 flex flex-col justify-between gap-7 md:flex-row md:items-end">

                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-[#879779]" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#718467]">
                                Opportunities Near You
                            </span>
                        </div>

                        <h2 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#252720] md:text-6xl">
                            Be part of
                            <br />
                            <span className="font-serif font-normal italic text-[#879779]">
                                something meaningful.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-[#77766D] md:text-base">
                            Discover upcoming community initiatives.
                            Find an opportunity, meet people, and
                            make a positive difference together.
                        </p>
                    </div>

                    <Link
                        href="/upcoming-events"
                        className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#DCDDD4] px-6 py-3.5 text-sm font-semibold text-[#34392F] transition-all hover:border-[#879779] hover:bg-[#EAEFE5]"
                    >
                        Explore all events
                        <ArrowUpRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                        />
                    </Link>
                </div>

                {/* Exactly six maximum */}
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {events.slice(0, 6).map((event, index) => {
                            const form = event.form;
                            const Icon = getCategoryIcon(form.eventType);

                            return (
                                <article
                                    key={event._id}
                                    className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#E8E7DF] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C6D0BC] hover:shadow-[0_18px_45px_rgba(37,39,32,0.09)]"
                                >
                                    {/* Image */}
                                    <div className="relative h-60 overflow-hidden bg-[#E8EDE3]">

                                        {form.imageUrl ? (
                                            <img
                                                src={form.imageUrl}
                                                alt={form.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-[#879779]">
                                                <HeartHandshake size={55} />
                                            </div>
                                        )}

                                        {/* Category */}
                                        <div className="absolute left-4 top-4">
                                            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#596B50] shadow-sm">
                                                <Icon size={14} />
                                                {form.eventType || "Community"}
                                            </span>
                                        </div>

                                        {/* Date */}
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-[#252720]/90 px-3 py-2 text-white backdrop-blur-md">
                                            <CalendarDays
                                                size={15}
                                                className="text-[#B7C9A8]"
                                            />
                                            <span className="text-xs font-semibold">
                                                {formatDate(form.eventDate)}
                                            </span>
                                        </div>

                                        <span className="absolute bottom-4 right-4 text-xs font-semibold text-white/80">
                                            {String(index + 1).padStart(2, "0")} / 06
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-1 flex-col p-6">

                                        <h3 className="line-clamp-2 text-xl font-semibold leading-snug tracking-tight text-[#252720] transition-colors group-hover:text-[#718467]">
                                            {form.title}
                                        </h3>

                                        <div className="mt-3 flex items-center gap-2 text-xs text-[#85847A]">
                                            <MapPin
                                                size={15}
                                                className="shrink-0 text-[#879779]"
                                            />
                                            <span className="line-clamp-1">
                                                {form.location}
                                            </span>
                                        </div>

                                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#85847A]">
                                            {form.description}
                                        </p>

                                        <div className="mt-auto pt-6">

                                            <div className="mb-5 flex items-center gap-2 border-t border-[#EEEDE7] pt-4 text-xs text-[#8B8B80]">
                                                <UsersRound
                                                    size={15}
                                                    className="text-[#879779]"
                                                />
                                                Community initiative
                                            </div>

                                            <Link
                                                href={`/upcoming-events/${event._id}`}
                                                className="flex w-full items-center justify-between rounded-xl bg-[#879779] px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#65775B]"
                                            >
                                                Discover Event
                                                <ArrowUpRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="rounded-3xl border border-dashed border-[#D8DDD0] bg-white px-6 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF0E6] text-[#718467]">
                            <HeartHandshake size={30} />
                        </div>

                        <h3 className="mt-6 text-xl font-semibold text-[#252720]">
                            New opportunities are on their way.
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#85847A]">
                            There are no upcoming events right now.
                            Create a community initiative and inspire
                            others to participate.
                        </p>

                        <Link
                            href="/create-event"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#879779] px-6 py-3 text-sm font-semibold text-white hover:bg-[#65775B]"
                        >
                            Create an event
                            <ArrowUpRight size={17} />
                        </Link>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-12 flex flex-col justify-between gap-6 rounded-2xl bg-[#252720] p-7 md:flex-row md:items-center md:px-10">

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B7C9A8]">
                            The power of togetherness
                        </p>

                        <h3 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                            Have an initiative in mind?
                        </h3>

                        <p className="mt-2 text-sm text-white/60">
                            Bring your neighbors together and make
                            something meaningful happen.
                        </p>
                    </div>

                    <Link
                        href="/create-event"
                        className="inline-flex w-fit shrink-0 items-center gap-3 rounded-xl bg-[#A8B99A] px-6 py-4 text-sm font-semibold text-[#252720] transition-colors hover:bg-white"
                    >
                        Create an event
                        <ArrowUpRight size={17} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default RecentUpcomingEvents;