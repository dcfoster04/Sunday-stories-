"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Input, Label } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { TRY_IT_TEMPLATES } from "@/content/marketing";
import { TONE_LABELS } from "@/lib/types";

const TONE_OPTIONS = ["espn", "locker_room", "savage"] as const;
type ToneOption = (typeof TONE_OPTIONS)[number];

const PLACEHOLDER_LEAGUE = "The League of Extraordinary Regrets";

/** "Regrets" -> "Regrets'", "Villains" -> "Villains'", but "The Dynasty" -> "The Dynasty's" — avoids the awkward double-s that most fantasy league names (plurals) would otherwise get. */
function possessive(name: string) {
  return /s$/i.test(name) ? `${name}'` : `${name}'s`;
}

function fill(template: string, league: string) {
  return template.replace(/\{league_poss\}/g, possessive(league)).replace(/\{league\}/g, league);
}

export function TryItSection() {
  const [leagueName, setLeagueName] = useState("");
  const [tone, setTone] = useState<ToneOption>("espn");
  const [variantIndex, setVariantIndex] = useState(0);

  const displayLeague = leagueName.trim() || PLACEHOLDER_LEAGUE;
  const variants = TRY_IT_TEMPLATES[tone];
  const template = variants[variantIndex % variants.length];

  const headline = useMemo(() => fill(template.headline, displayLeague), [template, displayLeague]);
  const body = useMemo(() => fill(template.body, displayLeague), [template, displayLeague]);

  return (
    <section className="border-t border-ink-950/8 bg-paper-100 py-24 sm:py-32">
      <Container size="wide">
        <Reveal className="text-center">
          <p className="kicker text-flare-600">Try it yourself — no signup required</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tighter text-ink-950 sm:text-5xl">
            See what we&rsquo;d say about your league.
          </h2>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-10">
          <Reveal delay={80}>
            <div className="space-y-6">
              <div>
                <Label htmlFor="tryItLeague">Your league&rsquo;s name</Label>
                <Input
                  id="tryItLeague"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  placeholder={PLACEHOLDER_LEAGUE}
                />
              </div>

              <div>
                <Label>Pick a tone</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        setTone(t);
                        setVariantIndex(0);
                      }}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        tone === t
                          ? "border-flare-400 bg-flare-400 text-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]"
                          : "border-ink-950/15 bg-white text-ink-950 hover:border-ink-950/35"
                      }`}
                    >
                      <p className="font-display text-sm font-bold uppercase tracking-wide">
                        {TONE_LABELS[t].split(" — ")[0]}
                      </p>
                      <p className={`mt-0.5 text-xs ${tone === t ? "text-ink-950/60" : "text-ink-950/45"}`}>
                        {TONE_LABELS[t].split(" — ")[1] ?? ""}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setVariantIndex((i) => i + 1)}
                className="w-full sm:w-auto"
              >
                Give me another angle
              </Button>

              <div className="border-t border-ink-950/8 pt-6">
                <p className="text-sm leading-relaxed text-ink-950/55">
                  This is a canned preview — your real coverage is written
                  fresh from your league&rsquo;s actual managers, rivalries,
                  and lore.
                </p>
                <div className="mt-4">
                  <ButtonLink href="/onboarding">Start My League</ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <article className="relative flex h-full flex-col overflow-hidden rounded-lg bg-ink-950 bg-grain p-7 text-paper-100 shadow-[var(--shadow-card-dark)] sm:p-9">
              <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
              <Badge tone="flare" className="w-fit">
                {template.tag}
              </Badge>
              <h3 className="mt-5 text-balance font-display text-2xl font-bold leading-snug sm:text-3xl">
                {headline}
              </h3>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-mist-300">{body}</p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-mist-500">
                {template.kicker} &middot; Sunday Stories
              </p>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
