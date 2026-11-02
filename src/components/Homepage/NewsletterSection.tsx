
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
    ArrowUpRight,
    Mail,
    Send,
    HeartHandshake,
    Leaf,
    HandHeart,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubscribe = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            const warningMessage = "Please enter your email address.";

            setMessage(warningMessage);

            toast.warning("Email required", {
                description: warningMessage,
            });
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            const errorMessage =
                "Newsletter service is not configured yet.";

            setMessage(errorMessage);

            toast.error("Subscription unavailable", {
                description: errorMessage,
            });
            return;
        }

        if (submitting) return;

        setSubmitting(true);
        setMessage("");

        const toastId = toast.loading("Subscribing you...", {
            description: "Adding you to the Kindora Letter.",
        });

        try {
            const response = await fetch(`${apiUrl}/newsletter`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    source: "homepage",
                }),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    result?.message || "Could not subscribe right now."
                );
            }

            const alreadySubscribed = Boolean(
                result?.alreadySubscribed
            );

            const successMessage = alreadySubscribed
                ? "You are already subscribed to the Kindora Letter."
                : "You're subscribed! Good news is on its way.";

            setMessage(successMessage);
            setEmail("");

            toast.success(
                alreadySubscribed ? "Already subscribed" : "Subscribed!",
                {
                    id: toastId,
                    description: successMessage,
                }
            );
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.";

            setMessage(errorMessage);

            toast.error("Subscription failed", {
                id: toastId,
                description: errorMessage,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="relative overflow-hidden bg-[#F5F2EA] py-24 md:py-32">

            <div className="mx-auto max-w-7xl px-5 md:px-10">

                <div className="grid overflow-hidden rounded-[30px] bg-white shadow-[0_20px_70px_rgba(37,39,32,0.06)] lg:grid-cols-12">

                    {/* Left Editorial Panel */}
                    <div className="relative flex flex-col justify-between overflow-hidden bg-[#E8EDE3] p-8 md:p-12 lg:col-span-5 lg:p-14">

                        {/* Decorative circles */}
                        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-[#879779]/20" />
                        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#879779]/20" />

                        <div className="relative z-10">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#708364] shadow-sm">
                                <HeartHandshake size={25} strokeWidth={1.6} />
                            </div>

                            <div className="mt-12">
                                <span className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#718467]">
                                    Stay close to your community
                                </span>

                                <h2 className="mt-5 text-4xl font-semibold leading-[1.13] tracking-[-0.04em] text-[#252720] md:text-5xl">
                                    Good things
                                    <br />
                                    happen when
                                    <br />
                                    <span className="font-serif font-normal italic text-[#829477]">
                                        we come together.
                                    </span>
                                </h2>

                                <p className="mt-6 max-w-sm text-sm leading-7 text-[#72766A]">
                                    Discover meaningful ways to help, meet people who care,
                                    and stay connected with the initiatives changing
                                    communities around you.
                                </p>
                            </div>

                        </div>

                        {/* Bottom Categories */}
                        <div className="relative z-10 mt-14">

                            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#718467]">
                                Causes worth caring about
                            </p>

                            <div className="flex flex-wrap gap-2">

                                {[
                                    { name: "Community Care", icon: HeartHandshake },
                                    { name: "Environment", icon: Leaf },
                                    { name: "Social Support", icon: HandHeart },
                                ].map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <span
                                            key={item.name}
                                            className="inline-flex items-center gap-2 rounded-full border border-[#CFD9C7] bg-white/70 px-3 py-2 text-[10px] font-semibold text-[#596B50]"
                                        >
                                            <Icon size={13} />
                                            {item.name}
                                        </span>
                                    );
                                })}

                            </div>
                        </div>

                    </div>

                    {/* Right Newsletter Panel */}
                    <div className="relative flex flex-col justify-center p-8 md:p-12 lg:col-span-7 lg:p-16">

                        <div className="absolute right-10 top-10 hidden h-20 w-20 items-center justify-center rounded-full bg-[#F5F2EA] text-[#879779] md:flex">
                            <Sparkles size={30} strokeWidth={1.3} />
                        </div>

                        <div className="max-w-xl">

                            <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F3EC] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#708364]">
                                <Mail size={13} />
                                The Kindora Letter
                            </div>

                            <h3 className="mt-8 text-3xl font-semibold leading-tight tracking-tight text-[#252720] md:text-5xl">
                                A little good news
                                <br />
                                <span className="font-serif font-normal italic text-[#879779]">
                                    in your inbox.
                                </span>
                            </h3>

                            <p className="mt-5 max-w-md text-sm leading-7 text-[#85847A]">
                                Be the first to know about upcoming volunteer opportunities,
                                community campaigns and inspiring initiatives happening
                                near you.
                            </p>

                            {/* Subscription Form */}
                            <form onSubmit={handleSubscribe} className="mt-9">

                                <label
                                    htmlFor="newsletter-email"
                                    className="mb-3 block text-xs font-semibold text-[#393B34]"
                                >
                                    Your email address
                                </label>

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#E6E5DD] bg-[#FAFAF8] px-4 transition-colors focus-within:border-[#879779] focus-within:ring-2 focus-within:ring-[#879779]/10">

                                        <Mail size={18} className="shrink-0 text-[#A1A294]" />

                                        <input
                                            id="newsletter-email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="h-14 w-full min-w-0 bg-transparent text-sm text-[#252720] outline-none placeholder:text-[#AAA99F]"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-xl bg-[#879779] px-7 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#65775B] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {submitting
                                            ? "Subscribing..."
                                            : "Stay Connected"}
                                        <Send size={16} />
                                    </button>

                                </div>

                                {message && (
                                    <p role="status" className="mt-3 text-xs text-[#65775B]">
                                        {message}
                                    </p>
                                )}

                            </form>

                            {/* Trust Information */}
                            <div className="mt-7 flex items-start gap-3">

                                <CheckCircle2
                                    size={17}
                                    className="mt-0.5 shrink-0 text-[#879779]"
                                />

                                <p className="text-xs leading-6 text-[#96948B]">
                                    Your inbox deserves meaningful updates. No unnecessary
                                    emails, just community opportunities worth your time.
                                </p>

                            </div>

                            {/* Bottom Message */}
                            <div className="mt-12 border-t border-[#ECEAE3] pt-7">

                                <div className="flex items-center justify-between gap-4">

                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#879779]">
                                            Kindora Community
                                        </p>

                                        <p className="mt-2 text-sm font-medium text-[#45463E]">
                                            Stay informed. Stay involved.
                                        </p>
                                    </div>

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0F3EC] text-[#879779]">
                                        <ArrowUpRight size={22} />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    );
};

export default NewsletterSection;
