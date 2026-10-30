import Link from "next/link";
import Image from "next/image";
import {
    LuArrowUpRight,
    LuHeart,
    LuMail,
    LuMapPin
} from "react-icons/lu";

import {
    FaInstagram,
    FaFacebookF,
    FaLinkedinIn,
    FaYoutube
} from "react-icons/fa6";

import LOGO from "../../public/LOGO.png";
import CurrentYear from "./CurrentYear";

const exploreLinks = [
    { name: "Home", href: "/" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Applications", href: "/applications" },
    { name: "Resources", href: "/resources" },
    { name: "Community Chat", href: "/chat" },
];

const platformLinks = [
    { name: "About Us", href: "/about" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
];

// FIXED: Map icons to their correctly imported React Icon components
const socialLinks = [
    {
        name: "Instagram",
        href: "https://instagram.com",
        icon: FaInstagram,
    },
    {
        name: "Facebook",
        href: "https://facebook.com",
        icon: FaFacebookF,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com",
        icon: FaLinkedinIn,
    },
    {
        name: "YouTube",
        href: "https://youtube.com",
        icon: FaYoutube,
    },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-neutral-200/60 bg-gradient-to-r from-[#F4F4F3] via-[#FAF9F5] to-[#FFFBF0] text-neutral-800 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 dark:border-neutral-800 select-none">

            <div className="container mx-auto px-5 md:px-8 pt-14 pb-10">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* Brand Section */}
                    <div className="lg:col-span-5 space-y-5">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 group"
                        >
                            <div className="relative w-11 h-11">
                                <Image
                                    src={LOGO}
                                    alt="Humanova Logo"
                                    fill
                                    sizes="44px"
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-semibold tracking-wide">
                                Humanova
                            </span>
                        </Link>

                        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight max-w-md">
                            Together, we create a{" "}
                            <span className="text-neutral-500 dark:text-neutral-400">
                                better tomorrow.
                            </span>
                        </h2>

                        <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-7 max-w-md">
                            Connecting people, opportunities, and communities
                            to make meaningful social impact. Discover
                            opportunities, take action, and create positive
                            change together.
                        </p>

                        {/* Social Links Layout */}
                        <div className="flex items-center gap-2 pt-2">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.name}
                                        className="w-10 h-10 flex items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-300 hover:bg-[#121214] hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 transition-all duration-300"
                                    >
                                        <Icon size={17} />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explore Links Menu */}
                    <div className="lg:col-span-3">
                        <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider text-neutral-400">
                            Explore
                        </h3>
                        <ul className="space-y-4">
                            {exploreLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                                    >
                                        <span>{link.name}</span>
                                        {/* FIXED: Changed to LuArrowUpRight */}
                                        <LuArrowUpRight
                                            size={14}
                                            className="opacity-0 -translate-y-0.5 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Platform Links Menu */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider text-neutral-400">
                            Platform
                        </h3>
                        <ul className="space-y-4">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                                    >
                                        <span>{link.name}</span>
                                        {/* FIXED: Changed to LuArrowUpRight */}
                                        <LuArrowUpRight
                                            size={14}
                                            className="opacity-0 -translate-y-0.5 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200"
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Location Info Section */}
                    <div className="lg:col-span-2">
                        <h3 className="text-sm font-semibold mb-5 uppercase tracking-wider text-neutral-400">
                            Get in Touch
                        </h3>
                        <div className="space-y-4">
                            <a
                                href="mailto:hello@humanova.com"
                                className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
                            >
                                {/* FIXED: Changed to LuMail */}
                                <LuMail size={17} className="shrink-0 mt-0.5" />
                                <span>hello@humanova.com</span>
                            </a>

                            <div className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                {/* FIXED: Changed to LuMapPin */}
                                <LuMapPin size={17} className="shrink-0 mt-0.5" />
                                <span>123 Impact St, Suite 400</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sub-Footer Copyright Area */}
                <div className="mt-14 pt-6 border-t border-neutral-200/50 dark:border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <p>© <CurrentYear /> Humanova. All rights reserved.</p>
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <LuHeart size={12} className="text-red-500 fill-red-500 animate-pulse" />
                        <span>for a better world</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
