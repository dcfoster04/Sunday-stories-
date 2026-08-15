"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import type { LeagueProfileData } from "@/lib/ai/types";

const SPOTLIGHT_META = {
  titleContender: { label: "Title Contender", accent: "text-flare-400" },
  darkHorse: { label: "Dark Horse", accent: "text-cobalt-400" },
  chaosAgent: { label: "Chaos Agent", accent: "text-crimson-400" },
} as const;

export function Completion({
  leagueName,
  profile,
  inviteSlug,
}: {
  leagueName: string;
  profile: LeagueProfileData;
  inviteSlug: string;
}) {
  const [copied, setCopied] = useState(false);
  const inviteUrl =
    typeof window !== "undefined" ? `${window.location.origin}/join/${inviteSlug}` : `/join/${inviteSlug}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — fall through silently, link is still visible/selectable
    }
  }

  const smsHref = `sms:?&body=${encodeURIComponent(
    `${leagueName} just joined Sunday Stories. Help us get the full picture: ${inviteUrl}`,
  )}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    `${leagueName} needs your input`,
  )}&body=${encodeURIComponent(
    `Our league just signed up for Sunday Stories, and it needs your side of the story.\n\n${inviteUrl}`,
  )}`;

  const spotlights = (
    ["titleContender", "darkHorse", "chaosAgent"] as const
  )
    .map((key) => ({ key, value: profile[key] }))
    .filter((s): s is { key: keyof typeof SPOTLIGHT_META; value: NonNullable<LeagueProfileData["titleContender"]> } =>
      Boolean(s.value),
    );

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <Reveal>
        <Kicker tone="flare">Sunday Stories has met your league.</Kicker>
        <h1 className="mx-auto mt-4 max-w-xl text-balance font-display text-3xl font-black uppercase leading-tight tracking-tighter text-ink-950 sm:text-5xl">
          Scouting Report
        </h1>
        <div className="mt-4 flex justify-center">
          <Badge tone="flare">{profile.leagueArchetype}</Badge>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="relative mt-8 overflow-hidden rounded-lg bg-ink-950 bg-grain p-8 text-left shadow-[var(--shadow-card-dark)] sm:p-10">
          <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
          <p className="whitespace-pre-line font-serif text-lg italic leading-relaxed text-paper-100 sm:text-xl">
            {profile.openingLine}
          </p>
        </div>
      </Reveal>

      {spotlights.length > 0 && (
        <Reveal delay={160}>
          <div className={`mt-6 grid grid-cols-1 gap-3 text-left ${spotlights.length > 1 ? "sm:grid-cols-3" : ""}`}>
            {spotlights.map(({ key, value }) => {
              const meta = SPOTLIGHT_META[key];
              return (
                <div key={key} className="rounded-lg border border-ink-950/8 bg-white p-5 shadow-[var(--shadow-card)]">
                  <p className={`kicker ${meta.accent}`}>{meta.label}</p>
                  <p className="mt-2 font-display text-base font-bold text-ink-950">{value.ownerName}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-950/60">{value.blurb}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {profile.rivalrySpotlight && (
        <Reveal delay={200}>
          <div className="mt-6 rounded-lg border border-crimson-500/25 bg-crimson-500/[0.04] p-6 text-left">
            <p className="kicker text-crimson-500">Rivalry to Watch</p>
            <p className="mt-2 font-display text-lg font-bold text-ink-950">{profile.rivalrySpotlight.matchup}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-950/60">{profile.rivalrySpotlight.blurb}</p>
          </div>
        </Reveal>
      )}

      {profile.superlatives.length > 0 && (
        <Reveal delay={240}>
          <div className="mt-6 text-left">
            <p className="kicker text-ink-950/40">Early superlatives</p>
            <div className="mt-3 space-y-2">
              {profile.superlatives.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 rounded-lg bg-ink-950/[0.03] p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-950">
                    {s.label}
                  </p>
                  <p className="text-sm text-ink-950/55 sm:text-right">
                    <span className="font-semibold text-ink-950/80">{s.ownerName}</span> — {s.blurb}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      <Reveal delay={280}>
        <div className="mt-8 rounded-lg bg-flare-400 p-6 text-left shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]">
          <p className="kicker text-ink-950/60">Bold prediction</p>
          <p className="mt-2 font-serif text-lg italic leading-relaxed text-ink-950">
            {profile.boldPrediction}
          </p>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <div className="mt-14">
          <p className="kicker text-ink-950/40">Invite your league</p>
          <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-ink-950">
            Get the rest of the story.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-950/55">
            Send this link to your league. Sunday Stories gets sharper with
            every manager who weighs in.
          </p>

          <div className="mx-auto mt-6 flex max-w-md items-center gap-2 rounded-full border border-ink-950/12 bg-white p-1.5 pl-5">
            <span className="flex-1 truncate text-left text-sm text-ink-950/70">{inviteUrl}</span>
            <Button size="sm" onClick={copyLink} className="shrink-0">
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <ButtonLink href={smsHref} variant="outline" size="sm">
              Text it
            </ButtonLink>
            <ButtonLink href={mailHref} variant="outline" size="sm">
              Email it
            </ButtonLink>
          </div>
        </div>
      </Reveal>

      <Reveal delay={360}>
        <div className="mt-14">
          <ButtonLink href="/dashboard" size="lg">
            Go to Dashboard
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
