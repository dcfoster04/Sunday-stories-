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
      <header className="border-b border-ink-950/8 bg-paper-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/dashboard/league" className="font-display text-base font-black tracking-tight text-ink-950">
              SUNDAY<span className="text-gold-600">STORIES</span>
            </Link>
            <span className="hidden text-sm text-ink-950/40 sm:inline">{leagueName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={copyLink}
              className="hidden rounded-full border border-ink-950/12 px-4 py-2 text-xs font-semibold text-ink-950/70 hover:border-ink-950/30 sm:block"
            >
              {copied ? "Link copied!" : "Copy invite link"}
            </button>
            <button
              onClick={signOut}
              disabled={signingOut}
              className="text-xs font-semibold text-ink-950/40 hover:text-ink-950"
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
                  "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-gold-500 text-ink-950"
                    : "border-transparent text-ink-950/45 hover:text-ink-950",
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
