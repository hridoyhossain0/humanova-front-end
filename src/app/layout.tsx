
import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { JoinedEventsProvider } from "@/components/providers/JoinedEventsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Humanova | Community Development Platform",
    template: "%s | Humanova",
  },
  description:
    "Discover, create, and join community service events. Make a positive difference in your community with Humanova.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JoinedEventsProvider>
          <Suspense
            fallback={
              <div
                className="h-[76px]"
                aria-hidden="true"
              />
            }
          >
            <NavBar />
          </Suspense>

          <main className="flex-1 pt-[76px]">
            {children}
          </main>

          <Footer />

          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </JoinedEventsProvider>
      </body>
    </html>
  );
}
