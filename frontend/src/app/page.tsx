import FeaturedPostsSection from "@/components/FeaturedPostsSection";
import HeroSection from "@/components/HeroSection";
import RecentPostsSection from "@/components/RecentPostsSection";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <HeroSection />
        <FeaturedPostsSection />
        <RecentPostsSection />
      </div>
    </>
  );
}
