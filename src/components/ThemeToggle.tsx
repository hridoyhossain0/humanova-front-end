'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const dark = savedTheme === 'dark';

        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
    }, []);

    const toggleTheme = () => {
        const nextIsDark = !isDark;

        setIsDark(nextIsDark);
        document.documentElement.classList.toggle('dark', nextIsDark);
        localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
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
