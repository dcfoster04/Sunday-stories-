"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

export type IssueSummary = {
  shareSlug: string;
  issueLabel: string;
  headline: string;
  dek: string;
  updatedAt: string; // ISO
};

const MIN_OWNERS = 2;

export function NewsroomHub({
  issue: initial,
  ownerCount,
}: {
  issue: IssueSummary | null;
  ownerCount: number;
}) {
  const router = useRouter();
  const [issue, setIssue] = useState(initial);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canGenerate = ownerCount >= MIN_OWNERS;
  const publicUrl = issue && typeof window !== "undefined" ? `${window.location.origin}/preview/${issue.shareSlug}` : "";

  async function generate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/preview-issue", { method: "POST" });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error ?? "Couldn't generate the issue.");
      setIssue({
        shareSlug: body.issue.shareSlug,
        issueLabel: body.issue.issueLabel,
        headline: body.issue.headline,
        dek: body.issue.dek,
        updatedAt: body.issue.updatedAt,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — link is still visible/clickable
    }
  }

  if (!issue) {
    return (
      <div className="mt-8">
        <EmptyState
          title="No issue published yet"
          description={
            canGenerate
              ? "Generate a Preseason Preview — a shareable issue built from your managers, lore, and rivalries. Ready to drop straight into the group chat."
              : `Add at least ${MIN_OWNERS} managers on the People page, then come back to run the presses.`
          }
        />
        <div className="mt-5 flex flex-col items-center gap-2">
          <Button onClick={generate} disabled={!canGenerate || generating}>
            {generating ? "Writing the issue..." : "Generate Preview Issue"}
          </Button>
          {error && <p className="text-sm text-crimson-500">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative mt-8 overflow-hidden rounded-lg bg-ink-950 bg-grain p-7 sm:p-9">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge tone="flare">{issue.issueLabel}</Badge>
          <h2 className="mt-3 max-w-xl text-balance font-display text-2xl font-black uppercase leading-tight tracking-tight text-paper-100 sm:text-3xl">
            {issue.headline}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-mist-300">{issue.dek}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-1.5 pl-5">
        <span className="flex-1 truncate text-left text-sm text-mist-300">{publicUrl || `/preview/${issue.shareSlug}`}</span>
        <Button size="sm" onClick={copyLink} className="shrink-0">
          {copied ? "Copied!" : "Copy link"}
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={`/preview/${issue.shareSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-flare-400/40 px-4 py-2 text-xs font-semibold text-flare-400 transition-colors hover:border-flare-400 hover:bg-flare-400/10"
        >
          View public issue &rarr;
        </a>
        <button
          type="button"
          onClick={generate}
          disabled={generating}
          className="rounded-full px-4 py-2 text-xs font-semibold text-mist-400 transition-colors hover:text-paper-100 disabled:opacity-40"
        >
          {generating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-crimson-400">{error}</p>}
    </div>
  );
}
