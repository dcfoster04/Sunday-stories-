import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/85 backdrop-blur-md">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-black tracking-tight text-paper-100"
          >
            SUNDAY<span className="text-flare-400">STORIES</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/demo"
              className="text-sm font-medium text-mist-300 transition-colors hover:text-paper-100"
            >
              See a Demo
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-mist-300 transition-colors hover:text-paper-100"
            >
              Pricing
            </Link>
          </nav>
          <ButtonLink href="/onboarding" size="sm">
            Start My League
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
