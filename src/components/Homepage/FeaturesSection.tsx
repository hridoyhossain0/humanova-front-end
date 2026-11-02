
import {
    PlusCircle,
    MapPin,
    Users,
    CalendarCheck,
    ArrowUpRight,
    HeartHandshake,
} from "lucide-react";

const features = [
    {
        number: "01",
        title: "Create a Local Initiative",
        description:
            "Turn your ideas into action. Organize food distributions, tree plantations, cleanup campaigns and other community-service events.",
        icon: PlusCircle,
        theme: "dark",
        tag: "FOR ORGANIZERS",
        span: "lg:col-span-2",
    },
    {
        number: "02",
        title: "Discover & Join",
        description:
            "Explore upcoming initiatives in your local area and find meaningful opportunities to volunteer.",
        icon: MapPin,
        theme: "sage",
        tag: "FOR VOLUNTEERS",
        span: "",
    },
    {
        number: "03",
        title: "Manage Your Events",
        description:
            "Keep your initiatives organized. Update event details, manage your activities and stay in control.",
        icon: CalendarCheck,
        theme: "light",
        tag: "EVENT MANAGEMENT",
        span: "",
    },
    {
        number: "04",
        title: "Track Your Participation",
        description:
            "See the events you've joined and keep your community-service journey organized in one place.",
        icon: Users,
        theme: "sand",
        tag: "YOUR ACTIVITY",
        span: "lg:col-span-2",
    },
];

const FeaturesSection = () => {
    return (
        <section className="overflow-hidden bg-[#F5F2EA] py-24 md:py-32">
            <div className="mx-auto max-w-7xl px-5 md:px-10">

                {/* Heading */}
                <div className="mx-auto mb-16 max-w-2xl text-center">

                    <span className="inline-flex items-center gap-2 rounded-full border border-[#DDE3D5] bg-[#EAF0E6] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#65775B]">
                        <HeartHandshake size={14} />
                        How Kindora Works
                    </span>

                    <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[#252720] md:text-6xl">
                        One platform.
                        <br />
                        <span className="font-serif font-normal italic text-[#829477]">
                            Countless ways to help.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#77766D] md:text-base">
                        From creating a neighborhood initiative to joining a
                        meaningful cause, Kindora makes community participation
                        easier for everyone.
                    </p>

                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {features.map((feature) => {
                        const Icon = feature.icon;
                        const dark = feature.theme === "dark";
                        const sage = feature.theme === "sage";
                        const sand = feature.theme === "sand";

                        return (
                            <article
                                key={feature.number}
                                className={`
                  group relative flex min-h-[300px] flex-col
                  justify-between overflow-hidden rounded-[24px]
                  border p-7 transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                  ${feature.span}

                  ${dark
                                        ? "border-[#252720] bg-[#252720] text-white"
                                        : sage
                                            ? "border-[#879779] bg-[#879779] text-white"
                                            : sand
                                                ? "border-[#E6DCCB] bg-[#EEE7DA] text-[#252720]"
                                                : "border-[#E7E3D9] bg-white text-[#252720]"
                                    }
                `}
                            >

                                {/* Decorative Circle */}
                                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-current opacity-[0.08] transition-transform duration-500 group-hover:scale-125" />

                                <div className="relative z-10 flex items-start justify-between">

                                    <div className={`
                    flex h-14 w-14 items-center justify-center
                    rounded-2xl
                    ${dark || sage
                                            ? "bg-white/10 text-white"
                                            : "bg-[#879779]/10 text-[#65775B]"
                                        }
                  `}>
                                        <Icon size={26} strokeWidth={1.6} />
                                    </div>

                                    <span className="text-xs font-semibold tracking-widest opacity-50">
                                        {feature.number}
                                    </span>

                                </div>

                                <div className="relative z-10 mt-12">

                                    <span className={`
                    text-[10px] font-bold tracking-[0.18em]
                    ${dark || sage
                                            ? "text-[#C3D0B9]"
                                            : "text-[#879779]"
                                        }
                  `}>
                                        {feature.tag}
                                    </span>

                                    <h3 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight">
                                        {feature.title}
                                    </h3>

                                    <p className={`
                    mt-3 max-w-md text-sm leading-7
                    ${dark
                                            ? "text-white/65"
                                            : sage
                                                ? "text-white/85"
                                                : "text-[#77766D]"
                                        }
                  `}>
                                        {feature.description}
                                    </p>

                                    <div className={`
                    mt-7 flex items-center justify-between
                    border-t pt-5
                    ${dark || sage
                                            ? "border-white/20"
                                            : "border-[#252720]/10"
                                        }
                  `}>
                                        <span className="text-xs font-semibold">
                                            {feature.number === "01"
                                                ? "Start an initiative"
                                                : feature.number === "02"
                                                    ? "Explore opportunities"
                                                    : feature.number === "03"
                                                        ? "Organize activities"
                                                        : "View your activities"}
                                        </span>

                                        <ArrowUpRight
                                            size={19}
                                            className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                                        />
                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>

                {/* Bottom Message */}
                <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center">

                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#F5F2EA] bg-[#879779] text-white"
                            >
                                <Users size={15} />
                            </div>
                        ))}
                    </div>

                    <p className="text-sm text-[#77766D]">
                        Every initiative begins with someone who cares.
                    </p>

                </div>

            </div>
        </section>
    );
};

export default FeaturesSection;
