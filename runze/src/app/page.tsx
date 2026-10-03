import { SiteHeader } from "@/components/site-header";
import { HeroBanner } from "@/components/hero-banner";
import { AboutSection } from "@/components/about-section";
import { WorksSection } from "@/components/works-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroBanner />
        <AboutSection />
        <WorksSection />
      </main>
      <SiteFooter />
    </>
  );
}
