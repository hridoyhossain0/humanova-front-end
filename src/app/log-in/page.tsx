'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

// Only same-origin absolute paths are allowed to prevent open redirects.
const safeCallbackPath = (value: string | null) =>
    value && value.startsWith('/') && !value.startsWith('//') ? value : '/';

const LogInForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = safeCallbackPath(
        searchParams.get('callbackUrl')
    );
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const toastId = toast.loading('Logging you in...', {
            description: 'Verifying your credentials.',
        });

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
                rememberMe: rememberMe,
                callbackURL: callbackUrl
            });

            if (data) {
                toast.success('Welcome back!', {
                    id: toastId,
                    description: 'You have logged in successfully.',
                });
                router.push(callbackUrl);
                return;
            }

            if (error) {
                const message =
                    error.message ||
                    'An error occurred during log in.';

                setErrorMsg(message);
                toast.error('Log in failed', {
                    id: toastId,
                    description: message,
                });
            }
        }
        catch (err) {
            console.error(err);

            const message =
                'Something went wrong. Please try again.';

            setErrorMsg(message);
            toast.error('Log in failed', {
                id: toastId,
                description: message,
            });
        }
        finally {
            setLoading(false);
        }
    };

    const handleSocialLogIn = async (provider: 'google') => {
        const toastId = toast.loading('Redirecting to Google...', {
            description: 'Opening a secure log-in window.',
        });

        try {
            setErrorMsg('');
            await authClient.signIn.social({
                provider,
                callbackURL: callbackUrl
            });
        }
        catch (err) {
            console.error(err);

            const message =
                'Failed to initialize social log in.';

            setErrorMsg(message);
            toast.error('Google log in failed', {
                id: toastId,
                description: message,
            });
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white px-6 select-none font-sans dark:bg-neutral-950">
            <div className="absolute left-5 top-5">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-[360px] flex flex-col text-center">

                {/* Header Typography */}
                <h1 className="text-[32px] font-bold tracking-tight text-[#0D3834] dark:text-neutral-100">
                    Welcome back
                </h1>
                <p className="text-sm text-[#0D3834] dark:text-neutral-100/80 dark:text-neutral-400 mt-2 font-medium">
                    Please enter your details.
                </p>

                {/* Error Banner Alert Feedback */}
                {errorMsg && (
                    <div className="mt-4 p-3 text-xs font-medium text-red-600 bg-red-50 rounded-lg text-left border border-red-100">
                        {errorMsg}
                    </div>
                )}

                {/* Input Form Action Area */}
                <form onSubmit={handleSubmit} className="mt-6 text-left flex flex-col w-full">

                    {/* Email Form Field */}
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="email"
                            className="text-xs font-bold text-[#0D3834] dark:text-neutral-100 mb-1.5"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full h-11 px-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#426043] focus:ring-1 focus:ring-[#426043] transition-all bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-600"
                        />
                    </div>

                    {/* Password Form Field */}
                    <div className="flex flex-col w-full mt-4">
                        <label
                            htmlFor="password"
                            className="text-xs font-bold text-[#0D3834] dark:text-neutral-100 mb-1.5"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full h-11 px-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#426043] focus:ring-1 focus:ring-[#426043] transition-all bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:placeholder-neutral-600"
                        />
                    </div>

                    {/* Meta Preferences & Utility Panel */}
                    <div className="flex items-center justify-between mt-5 w-full text-xs font-medium">
                        {/* Remember Me Checkbox Toggle */}
                        <label className="flex items-center space-x-2 text-[#0D3834] dark:text-neutral-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-neutral-300 text-[#426043] focus:ring-[#426043] dark:border-neutral-700 cursor-pointer transition-colors"
                            />
                            <span>Remember for 30 days</span>
                        </label>
                    </div>

                    {/* Primary Credentials Log In Trigger */}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-11 mt-6 bg-[#426043] hover:bg-[#364f37] disabled:bg-[#426043]/50 disabled:cursor-not-allowed active:scale-[0.99] text-white font-medium text-sm rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>

                    {/* Divider Decoration */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800"></div>
                        <span className="px-3 text-xs text-neutral-400 font-medium dark:text-neutral-500">or</span>
                        <div className="flex-1 border-t border-neutral-200 dark:border-neutral-800"></div>
                    </div>

                    {/* OAuth Google Actions Trigger */}
                    <button
                        onClick={() => handleSocialLogIn('google')}
                        type="button"
                        className="w-full h-11 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 active:scale-[0.99] text-neutral-700 font-medium text-sm dark:text-neutral-200 rounded-lg transition-all border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center space-x-2"
                    >
                        {/* Inline Google Colored SVG Logo Icon */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8.05 12.58a5.94 5.94 0 0 1 5.94-5.94c1.493 0 2.854.549 3.91 1.455l3.125-3.126C19.124 3.205 16.57 2 13.99 2 8.167 2 3.429 6.738 3.429 12.562c0 5.823 4.738 10.562 10.561 10.562 6.009 0 10.226-4.226 10.226-10.4 0-.677-.07-1.3-.2-1.92H12.24Z" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                </form>

                {/* Global Footer Navigation Links */}
                <p className="mt-8 text-xs text-[#0D3834] dark:text-neutral-100/80 dark:text-neutral-400 font-medium dark:text-neutral-500">
                    Don&apos;t have an account?{' '}
                    <Link
                        href="/register"
                        className="text-[#0D3834] dark:text-neutral-100 hover:underline font-bold transition-all ml-0.5"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

const LogInPage = () => (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-neutral-950" />}>
        <LogInForm />
    </Suspense>
);

export default LogInPage;
