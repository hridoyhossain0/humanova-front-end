import HeroSection from "@/components/Homepage/HeroSection";
import STATISTICS from "@/components/Homepage/STATISTICS";
import { connection } from "next/server";

// The homepage stats come from a live API fetch, so this route renders
// per request instead of being prerendered with uncached data.
export const instant = false;

async function getEvents() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  try {
    const response = await fetch(`${apiUrl}/events`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function Home() {
  // Wait for a real request before the uncached API call above runs.
  await connection();

  const events = await getEvents();

  return (
    <div>

      <STATISTICS events={events} />
      <HeroSection />
      
     


    </div>
  );
}
