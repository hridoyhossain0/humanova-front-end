import HeroSection from "@/components/Homepage/HeroSection";
import STATISTICS from "@/components/Homepage/STATISTICS";

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
  const events = await getEvents();

  return (
    <div>

      <STATISTICS events={events} />
      <HeroSection />
      
     


    </div>
  );
}
