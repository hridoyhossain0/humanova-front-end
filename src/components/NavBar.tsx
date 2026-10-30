
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

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

export default function NavBar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Get actual authentication session from Better Auth
    const { data: session, isPending } = authClient.useSession();

    const isLoggedIn = !!session?.user;

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Opportunities', href: '/opportunities' },
        { name: 'Applications', href: '/applications' },
        { name: 'Resources', href: '/resources' },
        { name: 'Chat', href: '/chat' },
    ];

    // Sign out using Better Auth
    const handleLogout = async () => {
        try {
            await authClient.signOut();

            setProfileOpen(false);
            setIsOpen(false);

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            <div className='bg-gradient-to-r from-[#F4F4F3]/90 via-[#FAF9F5]/90 to-[#FFFBF0]/90 dark:from-neutral-950/95 dark:via-neutral-900/95 dark:to-neutral-950/95'>
                <div className='container mx-auto'>


                <nav className="fixed inset-x-0 top-0 z-[100] w-full px-3 md:px-4 py-3 bg-[#FAF9F5]/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-between border-b border-neutral-200/40 dark:border-neutral-700/60 shadow-sm">

                    {/* Brand Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 group z-50"
                    >
                        <div className="relative w-10 h-10">
                            <Image
                                src={LOGO}
                                alt="Humanova Logo"
                                fill
                                sizes="40px"
                                className="object-contain"
                                priority
                            />
                        </div>

                        <span className="font-sans text-xl font-semibold tracking-wide text-neutral-800">
                            Humanova
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1 bg-white/40 backdrop-blur-md p-1 rounded-full border border-neutral-200/60 shadow-sm">

                        {navItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 ${isActive
                                        ? 'bg-[#121214] text-white shadow-sm'
                                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/40'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Authentication */}
                    <div className="hidden md:flex items-center space-x-3">

                        <ThemeToggle />

                        {isPending ? (
                            // Session loading
                            <div className="w-24 h-10 rounded-full bg-neutral-200/50 animate-pulse" />
                        ) : !isLoggedIn ? (
                            // Logged Out
                            <>
                                <Link
                                    href="/sign-in"
                                    className="px-5 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-200/40 transition-all"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/sign-up"
                                    className="px-5 py-2 text-sm font-medium bg-[#121214] hover:bg-neutral-800 text-white rounded-full shadow-sm transition-all"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            // Logged In
                            <div className="relative">

                                {/* Profile Button */}
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-neutral-200/60 transition-all"
                                    aria-label="Open profile menu"
                                    aria-expanded={profileOpen}
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#121214] text-white flex items-center justify-center overflow-hidden">
                                        {session?.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt="Profile"
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserRound size={21} />
                                        )}
                                    </div>

                                    <ChevronDown
                                        size={16}
                                        className={`text-neutral-600 transition-transform ${profileOpen ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 p-2">

                                        <div className="px-3 py-3 border-b border-neutral-100">
                                            <p className="text-sm font-semibold text-neutral-900 truncate">
                                                {session?.user?.name || 'User'}
                                            </p>

                                            <p className="text-xs text-neutral-500 truncate">
                                                {session?.user?.email}
                                            </p>
                                        </div>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut size={17} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <button
                        onClick={() => {
                            setIsOpen(!isOpen);
                            setProfileOpen(false);
                        }}
                        className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 z-50 rounded-full hover:bg-neutral-200/40 transition-colors"
                        aria-label="Toggle Menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                        </button>
                    </div>
                </nav>

                {/* Mobile Drawer */}
                <div
                    className={`fixed inset-0 z-40 bg-gradient-to-b from-[#F4F4F3] to-[#FFFBF0] pt-24 px-6 md:hidden flex flex-col justify-between pb-8 transition-transform duration-300 ease-in-out ${isOpen
                        ? 'translate-y-0'
                        : '-translate-y-full pointer-events-none'
                        }`}
                >

                    {/* Mobile Navigation Links */}
                    <div className="flex flex-col space-y-4">

                        {navItems.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`w-full px-6 py-3 text-lg font-medium rounded-full transition-all ${isActive
                                        ? 'bg-[#121214] text-white shadow-md'
                                        : 'text-neutral-600 hover:bg-neutral-200/40 hover:text-neutral-900'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Authentication */}
                    <div className="flex flex-col space-y-3 w-full border-t border-neutral-200/60 pt-6">

                        {isPending ? (
                            <div className="h-12 rounded-full bg-neutral-200/50 animate-pulse" />
                        ) : !isLoggedIn ? (
                            // Logged Out
                            <>
                                <Link
                                    href="/sign-in"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center px-5 py-3 text-base font-medium text-neutral-600 hover:bg-neutral-200/40 rounded-full transition-all"
                                >
                                    Sign In
                                </Link>

                                <Link
                                    href="/sign-up"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full text-center px-5 py-3 text-base font-medium bg-[#121214] text-white rounded-full shadow-md transition-all"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            // Logged In
                            <>
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-11 h-11 rounded-full bg-[#121214] text-white flex items-center justify-center overflow-hidden">
                                        {session?.user?.image ? (
                                            <Image
                                                src={session.user.image}
                                                alt="Profile"
                                                width={44}
                                                height={44}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <UserRound size={22} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-neutral-900 truncate">
                                            {session?.user?.name || 'User'}
                                        </p>

                                        <p className="text-xs text-neutral-500 truncate">
                                            {session?.user?.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}
