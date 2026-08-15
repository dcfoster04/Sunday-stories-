import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "Teach Sunday Stories Your League",
  description: "A conversational onboarding flow — takes about 7 minutes.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-paper-100">
      <header className="border-b border-ink-950/8">
        <Container size="wide">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="font-display text-base font-black tracking-tight text-ink-950">
              SUNDAY<span className="text-flare-600">STORIES</span>
            </Link>
            <p className="hidden text-sm text-ink-950/45 sm:block">
              Teach Sunday Stories Your League
            </p>
          </div>
        </Container>
      </header>
      <OnboardingWizard />
    </div>
  );
}
