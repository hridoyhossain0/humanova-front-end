import CommunityGallery from "@/components/Homepage/CommunityGallery";
import FeaturesSection from "@/components/Homepage/FeaturesSection";
import HeroSection from "@/components/Homepage/HeroSection";
import ImpactStats from "@/components/Homepage/ImpactStat";
import NewsletterSection from "@/components/Homepage/NewsletterSection";
import RecentUpcomingEvents from "@/components/Homepage/RecentUpcomingEvents";

export default function Home() {
  return (
    <div>

      <HeroSection />
      <ImpactStats />
      <FeaturesSection />

      <RecentUpcomingEvents />
      <CommunityGallery />
      <NewsletterSection />
    </div>
  );
}
