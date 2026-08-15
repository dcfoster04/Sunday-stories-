"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/league", label: "League" },
  { href: "/dashboard/people", label: "People" },
  { href: "/dashboard/lore", label: "Lore" },
  { href: "/dashboard/receipts", label: "Receipts" },
  { href: "/dashboard/stories", label: "Stories" },
] as const;

export function DashboardChrome({
  leagueName,
  inviteSlug,
  children,
}: {
  leagueName: string;
  inviteSlug: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/join/${inviteSlug}` : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — no-op, link is still visible in the UI
    }
  }

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper-200">
      {/* dark masthead — deliberately echoes the marketing site's cinematic
          sections so the dashboard reads as the same broadcast brand, not
          a bolted-on generic admin panel */}
      <header className="bg-ink-950">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard/league"
              className="font-display text-base font-black tracking-tight text-paper-100"
            >
              SUNDAY<span className="text-flare-400">STORIES</span>
            </Link>
            <span className="hidden text-sm text-mist-500 sm:inline">{leagueName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="hidden rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-mist-300 transition-colors hover:border-white/35 hover:text-paper-100 sm:block"
            >
              {copied ? "Link copied!" : "Copy invite link"}
            </button>
            <button
              onClick={signOut}
              disabled={signingOut}
              className="text-xs font-semibold text-mist-500 transition-colors hover:text-paper-100"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 sm:px-8">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap border-b-[3px] px-3 py-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-flare-400 text-paper-100"
                    : "border-transparent text-mist-500 hover:text-paper-200",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
