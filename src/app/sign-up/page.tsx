'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!acceptTerms) {
            setErrorMsg('You must accept the terms and conditions.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const { data, error } = await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: '/'
            });

            if (data) {
                router.push('/');
            }

            if (error) {
                setErrorMsg(error.message || 'An error occurred during sign up.');
            }
        }
        catch (err) {
            console.error(err);
            setErrorMsg('Something went wrong. Please try again.');
        }
        finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (provider: 'google') => {
        try {
            setErrorMsg('');
            await authClient.signIn.social({
                provider,
                callbackURL: '/'
            });
        }
        catch (err) {
            console.error(err);
            setErrorMsg('Failed to initialize social sign up.');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-6 select-none font-sans">
            <div className="w-full max-w-[360px] flex flex-col text-center">

                {/* Header Typography */}
                <h1 className="text-[32px] font-bold tracking-tight text-[#0D3834]">
                    Create an account
                </h1>
                <p className="text-sm text-[#0D3834]/80 mt-2 font-medium">
                    Start your journey with us today.
                </p>

                {/* Error Banner Alert Feedback */}
                {errorMsg && (
                    <div className="mt-4 p-3 text-xs font-medium text-red-600 bg-red-50 rounded-lg text-left border border-red-100">
                        {errorMsg}
                    </div>
                )}

                {/* Input Form Action Area */}
                <form onSubmit={handleSubmit} className="mt-6 text-left flex flex-col w-full">

                    {/* Name Form Field */}
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="name"
                            className="text-xs font-bold text-[#0D3834] mb-1.5"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full h-11 px-3.5 rounded-lg border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#426043] focus:ring-1 focus:ring-[#426043] transition-all bg-white text-neutral-800"
                        />
                    </div>

                    {/* Email Form Field */}
                    <div className="flex flex-col w-full mt-4">
                        <label
                            htmlFor="email"
                            className="text-xs font-bold text-[#0D3834] mb-1.5"
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
                            className="w-full h-11 px-3.5 rounded-lg border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#426043] focus:ring-1 focus:ring-[#426043] transition-all bg-white text-neutral-800"
                        />
                    </div>

                    {/* Password Form Field */}
                    <div className="flex flex-col w-full mt-4">
                        <label
                            htmlFor="password"
                            className="text-xs font-bold text-[#0D3834] mb-1.5"
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
                            className="w-full h-11 px-3.5 rounded-lg border border-neutral-200 text-sm placeholder-neutral-400 focus:outline-none focus:border-[#426043] focus:ring-1 focus:ring-[#426043] transition-all bg-white text-neutral-800"
                        />
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div className="flex items-center mt-5 w-full text-xs font-medium">
                        <label className="flex items-start space-x-2 text-[#0D3834] cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) => setAcceptTerms(e.target.checked)}
                                className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-[#426043] focus:ring-[#426043] cursor-pointer transition-colors"
                            />
                            <span className="leading-tight text-neutral-600">
                                I agree to the{' '}
                                <Link href="/terms" className="text-[#0D3834] hover:underline font-bold">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-[#0D3834] hover:underline font-bold">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>
                    </div>

                    {/* Primary Registration Submit Button */}
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full h-11 mt-6 bg-[#426043] hover:bg-[#364f37] disabled:bg-[#426043]/50 disabled:cursor-not-allowed active:scale-[0.99] text-white font-medium text-sm rounded-lg transition-all shadow-sm hover:shadow flex items-center justify-center"
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-neutral-200"></div>
                        <span className="px-3 text-xs text-neutral-400 font-medium">or</span>
                        <div className="flex-1 border-t border-neutral-200"></div>
                    </div>

                    {/* OAuth Google Actions Trigger */}
                    <button
                        onClick={() => handleSocialSignIn('google')}
                        type="button"
                        className="w-full h-11 bg-white hover:bg-neutral-50 active:scale-[0.99] text-neutral-700 font-medium text-sm rounded-lg transition-all border border-neutral-200 shadow-sm flex items-center justify-center space-x-2"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 0 1 8.05 12.58a5.94 5.94 0 0 1 5.94-5.94c1.493 0 2.854.549 3.91 1.455l3.125-3.126C19.124 3.205 16.57 2 13.99 2 8.167 2 3.429 6.738 3.429 12.562c0 5.823 4.738 10.562 10.561 10.562 6.009 0 10.226-4.226 10.226-10.4 0-.677-.07-1.3-.2-1.92H12.24Z" />
                        </svg>
                        <span>Sign up with Google</span>
                    </button>

                </form>

                {/* Global Footer Navigation Links */}
                <p className="mt-8 text-xs text-[#0D3834]/80 font-medium">
                    Already have an account?{' '}
                    <Link
                        href="/signin"
                        className="text-[#0D3834] hover:underline font-bold transition-all ml-0.5"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}
