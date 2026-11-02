
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
