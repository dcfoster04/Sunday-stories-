"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { LeagueProfileData } from "@/lib/ai/types";

const SPOTLIGHT_META = {
  titleContender: { label: "Title Contender", accent: "text-flare-400" },
  darkHorse: { label: "Dark Horse", accent: "text-cobalt-400" },
  chaosAgent: { label: "Chaos Agent", accent: "text-crimson-400" },
} as const;

/** Dashboard-side view of the same LeagueProfile shown at onboarding completion, with a "Regenerate" action for once more owners/lore have come in. */
export function ScoutingReportCard({ profile: initial }: { profile: LeagueProfileData | null }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function regenerate() {
    setRegenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/league-profile", { method: "POST" });
      if (!res.ok) throw new Error("Couldn't regenerate the scouting report.");
      const data = (await res.json()) as { profile: LeagueProfileData };
      setProfile(data.profile);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setRegenerating(false);
    }
  }

  if (!profile) {
    return (
      <div className="mt-10 rounded-lg border border-dashed border-ink-950/15 p-6 text-center">
        <p className="text-sm text-ink-950/50">No scouting report yet.</p>
        <div className="mt-4">
          <Button size="sm" onClick={regenerate} disabled={regenerating}>
            {regenerating ? "Generating..." : "Generate scouting report"}
          </Button>
        </div>
        {error && <p className="mt-3 text-sm text-crimson-500">{error}</p>}
      </div>
    );
  }

  const spotlights = (["titleContender", "darkHorse", "chaosAgent"] as const)
    .map((key) => ({ key, value: profile[key] }))
    .filter((s): s is { key: keyof typeof SPOTLIGHT_META; value: NonNullable<LeagueProfileData["titleContender"]> } =>
      Boolean(s.value),
    );

  return (
    <div className="relative mt-10 overflow-hidden rounded-lg bg-ink-950 bg-grain p-6 sm:p-8">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="kicker text-flare-400">Current scouting report</p>
          <div className="mt-2">
            <Badge tone="flare">{profile.leagueArchetype}</Badge>
          </div>
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={regenerating}
          className="shrink-0 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-mist-300 transition-colors hover:border-white/35 hover:text-paper-100 disabled:opacity-40"
        >
          {regenerating ? "Regenerating..." : "Regenerate"}
        </button>
      </div>

      <p className="mt-4 whitespace-pre-line font-serif text-base italic leading-relaxed text-paper-100">
        {profile.openingLine}
      </p>

      {spotlights.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {spotlights.map(({ key, value }) => {
            const meta = SPOTLIGHT_META[key];
            return (
              <div key={key} className="rounded-lg bg-white/[0.05] p-4">
                <p className={`kicker ${meta.accent}`}>{meta.label}</p>
                <p className="mt-1.5 font-display text-sm font-bold text-paper-100">{value.ownerName}</p>
                <p className="mt-1 text-xs leading-relaxed text-mist-400">{value.blurb}</p>
              </div>
            );
          })}
        </div>
      )}

      {profile.superlatives.length > 0 && (
        <div className="mt-6 space-y-1.5">
          {profile.superlatives.map((s, i) => (
            <p key={i} className="text-xs leading-relaxed text-mist-400">
              <span className="font-display font-bold uppercase tracking-wide text-mist-300">{s.label}</span>
              {" — "}
              <span className="font-semibold text-paper-200">{s.ownerName}</span>
            </p>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-crimson-400">{error}</p>}
    </div>
  );
}
