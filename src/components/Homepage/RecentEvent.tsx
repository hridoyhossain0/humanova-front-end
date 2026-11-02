
import Link from "next/link";
import {
    ArrowUpRight,
    ArrowRight,
    MapPin,
    CalendarDays,
    UsersRound,
    Heart,
} from "lucide-react";

const events = [
    {
        id: "winter-care",
        title: "A Little Warmth, A Brighter Winter",
        category: "Winter Support",
        location: "Mirpur 10, Dhaka",
        date: "DEC 15",
        year: "2026",
        description:
            "Help families facing the winter cold by distributing warm clothing, blankets and essential winter supplies.",
        organizer: "Kind Hearts Collective",
        image:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=85",
        featured: true,
        color: "bg-[#E9EFE4] text-[#64785A]",
    },
    {
        id: "green-neighborhood",
        title: "Grow a Greener Neighborhood",
        category: "Plantation",
        location: "Dhanmondi, Dhaka",
        date: "DEC 20",
        year: "2026",
        description:
            "Join local volunteers to plant trees and create healthier green spaces for the next generation.",
        organizer: "Green Community",
        image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85",
        featured: false,
        color: "bg-[#E9EFE4] text-[#64785A]",
    },
    {
        id: "community-kitchen",
        title: "Meals With Meaning",
        category: "Food Distribution",
        location: "Mohammadpur, Dhaka",
        date: "DEC 24",
        year: "2026",
        description:
            "Come together to prepare and distribute nutritious meals to people who need community support.",
        organizer: "Together We Care",
        image:
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&q=85",
        featured: false,
        color: "bg-[#F5EBDD] text-[#A17B4E]",
    },
];

const RecentEvent = () => {
    const [featuredEvent, ...otherEvents] = events;

    return (
        <section className="overflow-hidden bg-white py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 md:px-10">

                {/* Section Heading */}
                <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

                    <div className="max-w-2xl">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-9 bg-[#879779]" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#78886B]">
                                Make Your Next Move Matter
                            </span>
                        </div>

                        <h2 className="text-4xl font-semibold leading-tight tracking-tight text-[#252720] md:text-5xl">
                            Find a cause.
                            <br />
                            <span className="font-serif font-normal italic text-[#879779]">
                                Be part of the change.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-[#77766D] md:text-base">
                            Discover meaningful activities happening around your
                            community. Your time, your kindness, your impact.
                        </p>

                    </div>

                    <Link
                        href="/upcoming-events"
                        className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#E6E3DB] px-6 py-3 text-sm font-semibold text-[#252720] transition-all hover:border-[#879779] hover:bg-[#F5F2EA]"
                    >
                        Explore all events
                        <ArrowUpRight
                            size={17}
                            className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                    </Link>

                </div>

                {/* Events Layout */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

                    {/* Featured Event */}
                    <article className="group overflow-hidden rounded-[26px] border border-[#EAE8E1] bg-[#F8F7F3] lg:col-span-7">

                        <div className="relative h-[270px] overflow-hidden sm:h-[360px]">

                            <img
                                src={featuredEvent.image}
                                alt={featuredEvent.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            <div className="absolute left-5 top-5">
                                <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#65775B] shadow-sm">
                                    FEATURED INITIATIVE
                                </span>
                            </div>

                            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl bg-[#252720]/90 px-4 py-3 text-white backdrop-blur-sm">
                                <CalendarDays size={16} className="text-[#B7C7A9]" />
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/60">
                                        Event date
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {featuredEvent.date}, {featuredEvent.year}
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="p-6 md:p-8">

                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${featuredEvent.color}`}>
                                    {featuredEvent.category}
                                </span>
                                <span className="text-xs text-[#96948B]">
                                    Community initiative
                                </span>
                            </div>

                            <h3 className="mt-5 max-w-xl text-2xl font-semibold leading-snug tracking-tight text-[#252720] md:text-3xl">
                                {featuredEvent.title}
                            </h3>

                            <p className="mt-3 max-w-lg text-sm leading-7 text-[#77766D]">
                                {featuredEvent.description}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E7E3D9] pt-5">

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-[#77766D]">
                                        <MapPin size={15} className="text-[#829477]" />
                                        {featuredEvent.location}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-[#77766D]">
                                        <UsersRound size={15} className="text-[#829477]" />
                                        {featuredEvent.organizer}
                                    </div>
                                </div>

                                <Link
                                    href="/upcoming-events"
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#252720] px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#65775B]"
                                >
                                    Discover event
                                    <ArrowRight size={15} />
                                </Link>

                            </div>

                        </div>
                    </article>

                    {/* Supporting Events */}
                    <div className="flex flex-col gap-6 lg:col-span-5">

                        {otherEvents.map((event) => (
                            <article
                                key={event.id}
                                className="group flex flex-1 flex-col overflow-hidden rounded-[24px] border border-[#EAE8E1] bg-white transition-all duration-300 hover:border-[#C6D0BC] hover:shadow-lg sm:flex-row"
                            >

                                <div className="relative h-[210px] overflow-hidden sm:h-auto sm:min-h-[250px] sm:w-[43%]">

                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 shadow-sm">
                                        <p className="text-xs font-bold text-[#252720]">
                                            {event.date}
                                        </p>
                                        <p className="text-[9px] text-[#77766D]">
                                            {event.year}
                                        </p>
                                    </div>

                                </div>

                                <div className="flex flex-1 flex-col justify-between p-5">

                                    <div>
                                        <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold ${event.color}`}>
                                            {event.category}
                                        </span>

                                        <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-[#252720]">
                                            {event.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-3 text-xs leading-6 text-[#77766D]">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="mt-5 border-t border-[#EAE8E1] pt-4">

                                        <div className="mb-4 flex items-center gap-2 text-xs text-[#77766D]">
                                            <MapPin size={14} className="text-[#829477]" />
                                            {event.location}
                                        </div>

                                        <Link
                                            href="/upcoming-events"
                                            className="flex items-center justify-between text-xs font-bold text-[#65775B]"
                                        >
                                            View opportunity
                                            <ArrowUpRight
                                                size={17}
                                                className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                                            />
                                        </Link>

                                    </div>

                                </div>

                            </article>
                        ))}

                    </div>

                </div>

                {/* Bottom CTA */}
                <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#F5F2EA] p-7 md:flex-row md:px-10">

                    <div>
                        <div className="flex items-center gap-2 text-[#65775B]">
                            <Heart size={16} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                Your community needs you
                            </span>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold text-[#252720] md:text-2xl">
                            Have an idea worth bringing to life?
                        </h3>

                        <p className="mt-2 text-sm text-[#77766D]">
                            Create an initiative and invite others to make an impact.
                        </p>
                    </div>

                    <Link
                        href="/create-event"
                        className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-[#879779] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#65775B]"
                    >
                        Create an event
                        <ArrowUpRight size={17} />
                    </Link>

                </div>

            </div>
        </section>
    );
};

export default RecentEvent;
