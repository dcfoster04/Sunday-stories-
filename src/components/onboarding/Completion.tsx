"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

export function Completion({
  leagueName,
  scoutingReport,
  inviteSlug,
}: {
  leagueName: string;
  scoutingReport: string;
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

  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <Reveal>
        <Kicker tone="flare">Sunday Stories has met your league.</Kicker>
        <h1 className="mx-auto mt-4 max-w-xl text-balance font-display text-3xl font-black uppercase leading-tight tracking-tighter text-ink-950 sm:text-5xl">
          Scouting Report
        </h1>
      </Reveal>

      <Reveal delay={100}>
        <div className="relative mt-8 overflow-hidden rounded-lg bg-ink-950 bg-grain p-8 text-left shadow-[var(--shadow-card-dark)] sm:p-10">
          <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
          <p className="whitespace-pre-line font-serif text-lg italic leading-relaxed text-paper-100 sm:text-xl">
            {scoutingReport}
          </p>
        </div>
      </Reveal>

      <Reveal delay={180}>
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

      <Reveal delay={240}>
        <div className="mt-14">
          <ButtonLink href="/dashboard" size="lg">
            Go to Dashboard
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
