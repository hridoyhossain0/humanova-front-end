'use client';

import { useEffect, useState } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * Sonner toaster styled to match the shadcn theme.
 * The app stores its theme as a `dark` class on <html>, so we observe that
 * instead of depending on next-themes.
 */
export function Toaster(props: ToasterProps) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const root = document.documentElement;

        const syncTheme = () => {
            setTheme(
                root.classList.contains('dark') ? 'dark' : 'light'
            );
        };

        syncTheme();

        const observer = new MutationObserver(syncTheme);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <Sonner
            theme={theme}
            position="top-right"
            closeButton
            expand
            gap={12}
            visibleToasts={4}
            duration={4200}
            offset={84}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: 'group toast group-[.toaster]:rounded-2xl group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-2xl group-[.toaster]:shadow-black/10',
                    title: 'group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:tracking-tight',
                    description:
                        'group-[.toast]:text-xs group-[.toast]:leading-5 group-[.toast]:text-muted-foreground',
                    actionButton:
                        'group-[.toast]:rounded-lg group-[.toast]:bg-primary group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:text-primary-foreground',
                    cancelButton:
                        'group-[.toast]:rounded-lg group-[.toast]:bg-muted group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:text-muted-foreground',
                    closeButton:
                        'group-[.toast]:rounded-full group-[.toast]:border group-[.toast]:border-border group-[.toast]:bg-background group-[.toast]:text-foreground',
                },
            }}
            {...props}
        />
    );
}
