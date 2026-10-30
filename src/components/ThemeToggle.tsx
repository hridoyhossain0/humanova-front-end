'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

const subscribeToTheme = (onStoreChange: () => void) => {
    window.addEventListener('storage', onStoreChange);
    window.addEventListener('themechange', onStoreChange);

    return () => {
        window.removeEventListener('storage', onStoreChange);
        window.removeEventListener('themechange', onStoreChange);
    };
};

const getThemeSnapshot = () => localStorage.getItem('theme') === 'dark';
const getServerThemeSnapshot = () => false;

export default function ThemeToggle() {
    const isDark = useSyncExternalStore(
        subscribeToTheme,
        getThemeSnapshot,
        getServerThemeSnapshot,
    );

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, [isDark]);

    const toggleTheme = () => {
        const nextIsDark = !isDark;

        localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
        window.dispatchEvent(new Event('themechange'));
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200/70 bg-white/70 text-[#25245B] shadow-sm transition-all hover:bg-white hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800 dark:text-indigo-300 dark:hover:bg-neutral-700"
        >
            {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={21} strokeWidth={2} />}
        </button>
    );
}
