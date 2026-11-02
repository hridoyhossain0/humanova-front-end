
'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
    Menu,
    X,
    UserRound,
    LogOut,
    ChevronDown,
} from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import ThemeToggle from '@/components/ThemeToggle';
import LOGO from '../../public/LOGO.png';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Upcoming Events', href: '/upcoming-events' },
    
];

const userAcess = [
    { name: 'Create Event', href: '/create-event' },
    { name: 'Manage Events', href: '/manage-events' },
    { name: 'Joined Event', href: '/joined-events' },

]

// True only after hydration. The server snapshot is false so the first client
// render always matches the prerendered markup.
const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // The active route is only reliable in the browser. A prerendered copy of
    // this layout can be regenerated without a request URL (for example during
    // ISR revalidation), which renders no active link on the server while the
    // client resolves "/" from the address bar. Waiting for hydration keeps
    // the first client render identical to the server output and lets the
    // active state appear right after hydration.
    const mounted = useSyncExternalStore(
        subscribeToHydration,
        getHydratedSnapshot,
        getServerHydratedSnapshot,
    );

    const { data: session, isPending } = authClient.useSession();

    const isLoggedIn = !!session?.user;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Logout
    const handleLogout = async () => {
        const toastId = toast.loading('Signing you out...', {
            description: 'Closing your session securely.',
        });

        try {
            await authClient.signOut();
            setProfileOpen(false);
            setIsOpen(false);

            toast.success('Signed out', {
                id: toastId,
                description: 'You have been signed out successfully.',
            });

            router.replace('/');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);

            toast.error('Sign out failed', {
                id: toastId,
                description:
                    error instanceof Error
                        ? error.message
                        : 'Please try again.',
            });
        }
    };

    // Active route detection
    const isActive = (href: string) => {
        if (!mounted) return false;

        if (href === '/') return pathname === '/';

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-neutral-200/70 bg-[#FAF9F5]/90 shadow-sm backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/90">

            <nav className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* Logo */}
                <Link
                    href="/"
                    prefetch
                    className="group flex items-center gap-2"
                >
                    <div className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src={LOGO}
                            alt="Humanova Logo"
                            fill
                            priority
                            sizes="40px"
                            className="object-contain"
                        />
                    </div>

                    <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        Humanova
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 rounded-full border border-neutral-200/70 bg-white/60 p-1 shadow-sm md:flex dark:border-neutral-700 dark:bg-neutral-900/60">

                    {navItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch
                                aria-current={active ? 'page' : undefined}
                                className={`
                                    relative rounded-full px-4 py-2
                                    text-sm font-medium
                                    transition-all duration-200 ease-out
                                    active:scale-95
                                    ${active
                                        ? 'bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                                    }
                                `}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-3 md:flex">

                    <ThemeToggle />

                    {isPending ? (
                        <div className="h-10 w-24 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    ) : !isLoggedIn ? (
                        <>
                            <Link
                                href="/sign-in"
                                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200/60 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-neutral-700 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <div className="relative" ref={profileRef}>

                            <button
                                onClick={() => setProfileOpen((prev) => !prev)}
                                aria-label="Open profile menu"
                                aria-expanded={profileOpen}
                                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-neutral-200/70 dark:hover:bg-neutral-800"
                            >
                                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            width={36}
                                            height={36}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserRound size={20} />
                                    )}
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Dropdown */}
                            <div
                                className={`absolute right-0 top-12 w-60 origin-top-right rounded-xl border border-neutral-200 bg-white p-2 shadow-xl transition-all duration-200 dark:border-neutral-700 dark:bg-neutral-900 ${profileOpen
                                    ? 'visible translate-y-0 scale-100 opacity-100'
                                    : 'invisible -translate-y-2 scale-95 opacity-0'
                                    }`}
                            >
                                <div className="border-b border-neutral-100 px-3 py-3 dark:border-neutral-800">
                                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                                        {session.user.name || 'User'}
                                    </p>

                                    <p className="truncate text-xs text-neutral-500">
                                        {session.user.email}
                                    </p>
                                </div>


                                {userAcess.map((user) => {
                                    const active = isActive(user.href);

                                    return (
                                        <Link
                                            key={user.href}
                                            href={user.href}
                                            prefetch
                                            onClick={() => setProfileOpen(false)}
                                            aria-current={active ? 'page' : undefined}
                                            className={`
                                    mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                                    ${active
                                                    ? 'bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900'
                                                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
                                                }
                                `}
                                        >
                                            {user.name}
                                        </Link>
                                    );
                                })}

                                <button
                                    onClick={handleLogout}
                                    className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.98] dark:hover:bg-red-950/30"
                                >
                                    <LogOut size={17} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Actions */}
                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <button
                        onClick={() => setIsOpen((prev) => !prev)}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isOpen}
                        className="rounded-full p-2 text-neutral-800 transition hover:bg-neutral-200 active:scale-90 dark:text-white dark:hover:bg-neutral-800"
                    >
                        {isOpen ? (
                            <X size={23} />
                        ) : (
                            <Menu size={23} />
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-x-0 top-16 z-40 flex h-[calc(100dvh-4rem)] flex-col justify-between overflow-y-auto bg-[#FAF9F5] px-5 pb-8 pt-6 transition-all duration-300 ease-in-out md:hidden dark:bg-neutral-950 ${isOpen
                    ? 'visible translate-y-0 opacity-100'
                    : 'invisible -translate-y-3 opacity-0 pointer-events-none'
                    }`}
            >

                {/* Mobile Links */}
                <div className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                prefetch
                                onClick={() => setIsOpen(false)}
                                aria-current={active ? 'page' : undefined}
                                className={`flex items-center justify-between rounded-xl px-5 py-4 text-base font-medium transition-all duration-200 active:scale-[0.98] ${active
                                    ? 'bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900'
                                    : 'text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                    }`}
                            >
                                {item.name}

                                {active && (
                                    <span className="h-2 w-2 rounded-full bg-white dark:bg-neutral-900" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Authentication */}
                <div className="border-t border-neutral-200 pt-5 dark:border-neutral-800">

                    {isPending ? (
                        <div className="h-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                    ) : !isLoggedIn ? (
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/sign-in"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full border border-neutral-300 py-3 text-center font-medium text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                            >
                                Sign In
                            </Link>

                            <Link
                                href="/sign-up"
                                onClick={() => setIsOpen(false)}
                                className="rounded-full bg-neutral-900 py-3 text-center font-semibold text-white transition hover:bg-neutral-700 active:scale-95 dark:bg-white dark:text-neutral-900"
                            >
                               Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                                    {session.user.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="Profile"
                                            width={44}
                                            height={44}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserRound size={22} />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                                        {session.user.name || 'User'}
                                    </p>
                                    <p className="truncate text-xs text-neutral-500">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div> 

                            
     
                            {userAcess.map((user) => {
                                const active = isActive(user.href);

                                return (
                                    <Link
                                        key={user.href}
                                        href={user.href}
                                        prefetch
                                        onClick={() => setIsOpen(false)}
                                        aria-current={active ? 'page' : undefined}
                                        className={`
                                    flex w-full items-center gap-3 rounded-xl px-5 py-4 text-base font-medium transition-all duration-200 active:scale-[0.98]
                                    ${active
                                                ? 'bg-neutral-900 text-white shadow-md dark:bg-white dark:text-neutral-900'
                                                : 'text-neutral-700 hover:bg-neutral-200/60 dark:text-neutral-300 dark:hover:bg-neutral-800'
                                            }
                                `}
                                    >
                                        {user.name}
                                    </Link>
                                );
                            })}


                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-red-50 py-3 font-medium text-red-600 transition hover:bg-red-100 active:scale-[0.98] dark:bg-red-950/30 dark:hover:bg-red-950/50"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
