
import {
    ArrowUpRight,
    MapPin,
    HeartHandshake,
    Leaf,
    HandHeart,
    UsersRound,
} from "lucide-react";

const stories = [
    {
        id: 1,
        category: "WINTER SUPPORT",
        title: "A warmer winter for everyone.",
        location: "Mirpur, Dhaka",
        description:
            "Local volunteers bringing warmth and comfort to families through winter clothing distribution.",
        image:
            "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=85",
        icon: HandHeart,
        size: "lg:col-span-7 lg:row-span-2",
        featured: true,
    },
    {
        id: 2,
        category: "ENVIRONMENT",
        title: "Growing a greener tomorrow.",
        location: "Dhanmondi, Dhaka",
        description:
            "Small steps towards cleaner and greener neighborhoods.",
        image:
            "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=85",
        icon: Leaf,
        size: "lg:col-span-5",
        featured: false,
    },
    {
        id: 3,
        category: "COMMUNITY CARE",
        title: "Sharing meals, sharing hope.",
        location: "Mohammadpur, Dhaka",
        description:
            "Neighbors working together to support people in need.",
        image:
            "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&q=85",
        icon: HeartHandshake,
        size: "lg:col-span-5",
        featured: false,
    },
    {
        id: 4,
        category: "VOLUNTEER ACTION",
        title: "Better places begin with us.",
        location: "Uttara, Dhaka",
        description:
            "Community members coming together to make public spaces cleaner.",
        image:
            "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=900&q=85",
        icon: UsersRound,
        size: "lg:col-span-12",
        featured: false,
    },
];

const CommunityGallery = () => {
    return (
        <section className="relative overflow-hidden bg-[#252720] py-24 md:py-32">

            <div className="mx-auto max-w-7xl px-5 md:px-10">

                {/* Header */}
                <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">

                    <div className="lg:col-span-7">

                        <div className="mb-6 flex items-center gap-3">
                            <span className="h-px w-10 bg-[#A8B99A]" />

                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A8B99A]">
                                Beyond the ordinary
                            </span>
                        </div>

                        <h2 className="max-w-2xl text-4xl font-semibold leading-[1.12] tracking-tight text-[#F5F2EA] md:text-6xl">
                            Real people.
                            <br />
                            <span className="font-serif font-normal italic text-[#A8B99A]">
                                Real community change.
                            </span>
                        </h2>

                    </div>

                    <div className="lg:col-span-5 lg:pb-2">

                        <p className="max-w-md text-sm leading-7 text-[#B7B8AE] md:text-base">
                            Every community has a story worth sharing. Explore moments
                            of generosity, teamwork and positive action from people
                            making their neighborhoods better.
                        </p>

                        <div className="mt-6 flex items-center gap-3 text-sm font-medium text-[#C3D0B9]">
                            <HeartHandshake size={19} />
                            <span>Every helping hand makes a difference.</span>
                        </div>

                    </div>

                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">

                    {stories.map((story) => {
                        const Icon = story.icon;

                        return (
                            <article
                                key={story.id}
                                className={`
                  group relative isolate min-h-[310px]
                  overflow-hidden rounded-[22px]
                  bg-[#34382F]
                  ${story.size}
                  ${story.featured
                                        ? "lg:min-h-[660px]"
                                        : story.id === 4
                                            ? "lg:min-h-[280px]"
                                            : "lg:min-h-[315px]"
                                    }
                `}
                            >

                                {/* Background Image */}
                                <img
                                    src={story.image}
                                    alt={story.title}
                                    loading="lazy"
                                    className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Dark Overlay */}
                                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#171915]/95 via-[#171915]/20 to-transparent" />

                                {/* Top Badge */}
                                <div className="absolute left-5 top-5">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#252720]/50 px-3 py-2 text-[9px] font-bold tracking-[0.14em] text-white backdrop-blur-md">
                                        <Icon size={13} className="text-[#B7C9A8]" />
                                        {story.category}
                                    </span>
                                </div>

                                {/* Story Number */}
                                <span className="absolute right-5 top-5 text-xs font-medium tracking-widest text-white/70">
                                    0{story.id} / 04
                                </span>

                                {/* Bottom Content */}
                                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">

                                    <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#B7C9A8]">
                                        <MapPin size={13} />
                                        {story.location}
                                    </div>

                                    <div className="flex items-end justify-between gap-4">

                                        <div className="max-w-xl">

                                            <h3 className={`
                        font-semibold leading-tight tracking-tight text-white
                        ${story.featured
                                                    ? "text-3xl md:text-5xl"
                                                    : "text-2xl md:text-3xl"
                                                }
                      `}>
                                                {story.title}
                                            </h3>

                                            <p className="mt-3 max-w-lg text-xs leading-6 text-white/70 md:text-sm">
                                                {story.description}
                                            </p>

                                        </div>

                                        <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-[#A8B99A] group-hover:bg-[#A8B99A] group-hover:text-[#252720] sm:flex">
                                            <ArrowUpRight size={20} />
                                        </div>

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </div>

                {/* Bottom Statement */}
                <div className="mt-14 flex flex-col justify-between gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A8B99A]">
                            The power of togetherness
                        </p>

                        <h3 className="mt-3 text-2xl font-medium text-[#F5F2EA] md:text-3xl">
                            Your story could be next.
                        </h3>
                    </div>

                    <p className="max-w-sm text-sm leading-7 text-[#B7B8AE]">
                        Start an initiative, bring your neighbors together and create
                        a moment worth remembering.
                    </p>

                </div>

            </div>
        </section>
    );
};

export default CommunityGallery;
