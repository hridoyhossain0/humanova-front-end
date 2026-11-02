
import {
    Users,
    HeartHandshake,
    Sprout,
    Globe2,
    ArrowUpRight,
} from "lucide-react";

const impactStats = [
    {
        id: 1,
        value: "1,450+",
        label: "People making a difference",
        description: "Volunteers in our community",
        icon: Users,
        accent: "bg-[#E8EFE4] text-[#607653]",
    },
    {
        id: 2,
        value: "180+",
        label: "Meaningful gatherings",
        description: "Community events completed",
        icon: HeartHandshake,
        accent: "bg-[#F1EAE0] text-[#A27B4D]",
    },
    {
        id: 3,
        value: "24K+",
        label: "Lives touched",
        description: "Positive community impact",
        icon: Sprout,
        accent: "bg-[#E8ECEF] text-[#657D91]",
    },
];

const ImpactStats = () => {
    return (
        <section className="relative overflow-hidden bg-[#F5F2EA] py-20 md:py-28">
            <div className="mx-auto max-w-7xl px-5 md:px-10">

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

                    {/* Left Editorial Content */}
                    <div className="lg:col-span-4">
                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-9 bg-[#879779]" />
                            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#718267]">
                                Our Collective Impact
                            </span>
                        </div>

                        <h2 className="max-w-sm text-4xl font-semibold leading-[1.15] tracking-tight text-[#252720] md:text-5xl">
                            Small actions.
                            <span className="font-serif font-normal italic text-[#829477]">
                                {" "}Lasting change.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-[#77766D] md:text-base">
                            Every volunteer, every gathering, and every act of kindness
                            brings us closer to a more connected and compassionate world.
                        </p>

                        <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#34392F]">
                            Discover our mission
                            <ArrowUpRight size={17} />
                        </div>
                    </div>

                    {/* Right Statistics */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">

                        {impactStats.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.id}
                                    className={`group relative overflow-hidden rounded-2xl border border-[#E6E2D8] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#A8B39B] hover:shadow-[0_15px_40px_rgba(37,39,32,0.07)] ${index === 0 ? "sm:col-span-2" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.accent}`}
                                        >
                                            <Icon size={21} strokeWidth={1.7} />
                                        </div>

                                        <span className="text-xs font-medium tracking-widest text-[#B2B0A7]">
                                            0{stat.id}
                                        </span>
                                    </div>

                                    <div className="mt-7">
                                        <h3 className="text-4xl font-semibold tracking-[-0.06em] text-[#252720] md:text-5xl">
                                            {stat.value}
                                        </h3>

                                        <p className="mt-2 text-sm font-semibold text-[#393B34]">
                                            {stat.label}
                                        </p>

                                        <p className="mt-1 text-xs text-[#96948B]">
                                            {stat.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 h-[2px] w-full bg-[#F0EEE8]">
                                        <div
                                            className="h-full bg-[#8A9A75] transition-all duration-500 group-hover:w-full"
                                            style={{
                                                width: `${55 + index * 15}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Fourth Featured Statistic */}
                        <div className="flex flex-col justify-between rounded-2xl bg-[#252720] p-6 text-[#F5F2EA] transition-transform duration-300 hover:-translate-y-1 sm:col-span-2 lg:flex-row lg:items-center">
                            <div>
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#A8B49C]">
                                    A movement built by people
                                </span>

                                <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                                    100% Human.
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-[#B8B8AC]">
                                    Driven by compassion, powered by communities, and
                                    strengthened by every helping hand.
                                </p>
                            </div>

                            <div className="mt-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#66745C] bg-[#33382F] lg:ml-6 lg:mt-0">
                                <Globe2 size={30} strokeWidth={1.3} className="text-[#B6C3A8]" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImpactStats;
