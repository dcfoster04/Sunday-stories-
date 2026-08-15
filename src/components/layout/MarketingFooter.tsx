import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function MarketingFooter() {
  return (
    <footer className="border-t border-ink-950/8 bg-paper-100 py-12">
      <Container size="wide">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg font-black tracking-tight text-ink-950">
              SUNDAY<span className="text-flare-600">STORIES</span>
            </p>
            <p className="mt-2 max-w-sm text-sm text-ink-950/50">
              Your fantasy league has a story. We cover it.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink-950/60">
            <Link href="/demo" className="hover:text-ink-950">
              Demo
            </Link>
            <Link href="/onboarding" className="hover:text-ink-950">
              Start My League
            </Link>
            <Link href="/dashboard/login" className="hover:text-ink-950">
              Commissioner Sign In
            </Link>
          </nav>
        </div>
        <p className="mt-10 text-xs text-ink-950/35">
          © {new Date().getFullYear()} Sunday Stories. Made for the group chat.
        </p>
      </Container>
    </footer>
  );
}
