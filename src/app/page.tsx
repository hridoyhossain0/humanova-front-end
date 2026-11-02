import CommunityGallery from "@/components/Homepage/CommunityGallery";
import FeaturesSection from "@/components/Homepage/FeaturesSection";
import HeroSection from "@/components/Homepage/HeroSection";
import ImpactStats from "@/components/Homepage/ImpactStat";
import NewsletterSection from "@/components/Homepage/NewsletterSection";
import RecentEvent from "@/components/Homepage/RecentEvent";

export default function Home() {
  return (
    <div>

      <HeroSection />
      <ImpactStats />
      <FeaturesSection />
      <RecentEvent/>
      <CommunityGallery/>
      <NewsletterSection/>
    </div>
  );
}
