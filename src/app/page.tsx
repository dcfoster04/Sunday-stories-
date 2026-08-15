import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Hero } from "@/components/home/Hero";
import { DramaSection } from "@/components/home/DramaSection";
import { TryItSection } from "@/components/home/TryItSection";
import { DraftNightSection } from "@/components/home/DraftNightSection";
import { MemorySection } from "@/components/home/MemorySection";
import { PricingSection } from "@/components/home/PricingSection";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Sunday Stories — Your league has a story. We cover it.",
};

export default function Home() {
  return (
    <>
      <MarketingNav />
      <main>
        <Hero />
        <DramaSection />
        <TryItSection />
        <DraftNightSection />
        <MemorySection />
        <PricingSection />
        <FinalCta />
      </main>
      <MarketingFooter />
    </>
  );
}
