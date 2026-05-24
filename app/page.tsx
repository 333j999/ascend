import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Ticker } from "@/components/landing/ticker";
import { Features, MetricsBand, ManifestoSection } from "@/components/landing/features";
import { PreviewSection } from "@/components/landing/preview";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { FinalCTA, Footer } from "@/components/landing/cta-footer";

export default function LandingPage() {
  return (
    <main className="relative">
      <LandingNav />
      <Hero />
      <Ticker />
      <Features />
      <MetricsBand />
      <PreviewSection />
      <ManifestoSection />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}
