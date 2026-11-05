
import Link from "next/link";
import {
    ArrowRight,
    Heart,
    Users,
    MapPin,
    HandHeart,
    Leaf,
    Shirt,
    Utensils,
    Sparkles,
    MoveUpRight,
    CheckCircle2,
} from "lucide-react";

const causes = [
    {
        icon: Shirt,
        label: "Clothing drives",
        color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
    },
    {
        icon: Utensils,
        label: "Food support",
        color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    },
    {
        icon: Leaf,
        label: "Green initiatives",
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
];

const activities = [
    {
        title: "Community Care",
        description: "Helping families in need",
        icon: HandHeart,
        color: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
        status: "Making a difference",
    },
    {
        title: "Green Neighborhood",
        description: "Growing a greener tomorrow",
        icon: Leaf,
        color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
        status: "Join the movement",
    },
];

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#f8f8f1] dark:bg-[#121b16]">
            {/* Background decorations */}
            <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-200/20 blur-3xl" />

            <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-10">

                {/* LEFT CONTENT */}
                <div className="max-w-xl">

                    {/* Badge */}
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
                        <Sparkles size={15} className="text-emerald-600" />
                        Together, We Make a Difference
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl font-black leading-[1.12] tracking-tight text-[#172d25] dark:text-[#e8f0ea] sm:text-6xl lg:text-[68px]">
                        Be the Reason
                        <span className="mt-2 block text-emerald-600">
                            Someone Smiles.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="mt-7 max-w-lg text-base leading-8 text-gray-600 dark:text-slate-300 sm:text-lg">
                        Real change begins with ordinary people doing
                        extraordinary things together. Discover meaningful
                        community initiatives, support those in need, and
                        turn small acts of kindness into lasting impact.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-9 flex flex-wrap gap-4">
                        <Link
                            href="/upcoming-events"
                            className="group inline-flex items-center gap-3 rounded-xl bg-emerald-700 px-7 py-4 font-bold text-white shadow-lg shadow-emerald-900/15 transition-all hover:-translate-y-1 hover:bg-emerald-800"
                        >
                            Find Upcoming Events
                            <ArrowRight
                                size={19}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </Link>

                        <Link
                            href="/create-event"
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-4 font-bold text-[#172d25] transition-all hover:-translate-y-1 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900 dark:text-emerald-100 dark:hover:border-emerald-600 dark:hover:text-emerald-300"
                        >
                            <Heart size={18} />
                            Create an Initiative
                        </Link>
                    </div>

                    {/* Community Categories */}
                    <div className="mt-12">
                        <p className="mb-4 text-xs font-bold uppercase tracking-[2px] text-gray-400 dark:text-slate-500">
                            Make an impact through
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {causes.map((cause) => {
                                const Icon = cause.icon;

                                return (
                                    <div
                                        key={cause.label}
                                        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        <span className={`rounded-full p-1.5 ${cause.color}`}>
                                            <Icon size={15} />
                                        </span>
                                        {cause.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT VISUAL */}
                <div className="relative mx-auto w-full max-w-[520px]">

                    {/* Main visual card */}
                    <div className="relative rounded-[32px] bg-[#173c30] p-5 shadow-2xl shadow-emerald-950/20 sm:p-7">

                        {/* Card Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-200">
                                    The power of community
                                </p>
                                <h2 className="mt-1 text-2xl font-bold text-white">
                                    Small acts. Big change.
                                </h2>
                            </div>

                            <div className="rounded-2xl bg-white/10 p-3 text-emerald-200">
                                <HandHeart size={26} />
                            </div>
                        </div>

                        {/* Visual Illustration */}
                        <div className="relative my-7 flex h-[235px] items-center justify-center overflow-hidden rounded-2xl bg-[#dcebdc] dark:bg-[#223c30]">

                            <div className="absolute left-5 top-5 h-24 w-24 rounded-full bg-emerald-200/70" />
                            <div className="absolute bottom-0 left-0 h-20 w-full rounded-t-[50%] bg-emerald-300/60" />
                            <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-orange-200/70" />

                            {/* Community illustration */}
                            <div className="relative z-10 flex items-end justify-center gap-2">

                                <div className="flex flex-col items-center">
                                    <div className="h-10 w-10 rounded-full bg-[#b87952]" />
                                    <div className="mt-1 h-24 w-14 rounded-t-[22px] bg-orange-500" />
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-full bg-[#dba47b]" />
                                    <div className="mt-1 h-32 w-16 rounded-t-[24px] bg-emerald-700" />
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="h-10 w-10 rounded-full bg-[#8d5d45]" />
                                    <div className="mt-1 h-24 w-14 rounded-t-[22px] bg-yellow-500" />
                                </div>
                            </div>

                            {/* Floating icon */}
                            <div className="absolute right-5 top-5 rounded-2xl bg-white p-3 text-emerald-700 shadow-lg">
                                <Heart size={22} fill="currentColor" />
                            </div>

                            <div className="absolute bottom-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-emerald-800 shadow-md">
                                Kindness connects us
                            </div>
                        </div>

                        {/* Activity cards */}
                        <div className="space-y-3">
                            {activities.map((activity) => {
                                const Icon = activity.icon;

                                return (
                                    <div
                                        key={activity.title}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 transition hover:bg-white/15"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-xl p-3 ${activity.color}`}>
                                                <Icon size={21} />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white">
                                                    {activity.title}
                                                </h3>
                                                <p className="mt-1 text-xs text-emerald-100/70">
                                                    {activity.description}
                                                </p>
                                            </div>
                                        </div>

                                        <MoveUpRight
                                            size={19}
                                            className="shrink-0 text-emerald-200"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom text */}
                        <div className="mt-6 flex items-center gap-2 border-t border-white/15 pt-5 text-sm text-emerald-100">
                            <CheckCircle2 size={17} />
                            Every contribution matters.
                        </div>
                    </div>

                    {/* Floating community card */}
                    <div className="absolute -bottom-7 -left-5 hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40 sm:block md:-left-10">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-orange-100 p-3 text-orange-600 dark:bg-orange-950 dark:text-orange-300">
                                <Users size={23} />
                            </div>

                            <div>
                                <p className="text-lg font-black text-[#173c30] dark:text-emerald-100">
                                    One Community
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                    Countless possibilities
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Floating location card */}
                    <div className="absolute -right-4 top-20 hidden rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40 sm:block">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-slate-200">
                            <MapPin size={17} className="text-emerald-600" />
                            Start Locally
                        </div>
                        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                            Change begins nearby
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
