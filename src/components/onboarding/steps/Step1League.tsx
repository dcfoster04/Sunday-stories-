"use client";

import { StepShell } from "@/components/ui/StepShell";
import { Label, Input, Select, Textarea, HelperText } from "@/components/ui/Field";
import { SeriousnessSlider } from "@/components/ui/Slider";
import { Chip } from "@/components/ui/Chip";
import type { OnboardingState } from "../state";
import {
  LEAGUE_AGES,
  LEAGUE_AGE_LABELS,
  PLATFORMS,
  PLATFORM_LABELS,
  TONES,
  TONE_LABELS,
} from "@/lib/types";

export function Step1League({
  state,
  update,
  onNext,
}: {
  state: OnboardingState;
  update: (patch: Partial<OnboardingState["league"]>) => void;
  onNext: () => void;
}) {
  const { league } = state;
  const canContinue = league.leagueName.trim().length > 0 && league.platform && league.leagueAge && league.tone;

  return (
    <StepShell
      kicker="Step 1 of 5 — Meet the League"
      title="Let's start with the basics."
      helper="Takes about 7 minutes total. Don't overthink it — give us the stuff your group chat already knows."
      onNext={onNext}
      nextDisabled={!canContinue}
      hideBack
    >
      <div className="space-y-7">
        <div>
          <Label htmlFor="leagueName">League name</Label>
          <Input
            id="leagueName"
            value={league.leagueName}
            onChange={(e) => update({ leagueName: e.target.value })}
            placeholder="The League of Extraordinary Regrets"
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="platform">Fantasy platform</Label>
          <Select
            id="platform"
            value={league.platform}
            onChange={(e) => update({ platform: e.target.value as OnboardingState["league"]["platform"] })}
          >
            <option value="" disabled>
              Choose a platform
            </option>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>League age</Label>
          <div className="flex flex-wrap gap-2">
            {LEAGUE_AGES.map((age) => (
              <Chip
                key={age}
                selected={league.leagueAge === age}
                onClick={() => update({ leagueAge: age })}
              >
                {LEAGUE_AGE_LABELS[age]}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <Label>League seriousness</Label>
          <SeriousnessSlider
            value={league.seriousness}
            onChange={(v) => update({ seriousness: v })}
          />
        </div>

        <div>
          <Label>Sunday Stories tone</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TONES.map((tone) => (
              <button
                type="button"
                key={tone}
                onClick={() => update({ tone })}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  league.tone === tone
                    ? "border-ink-950 bg-ink-950 text-paper-100"
                    : "border-ink-950/12 bg-white text-ink-950 hover:border-ink-950/30"
                }`}
              >
                <p className="font-display text-sm font-bold uppercase tracking-wide">
                  {TONE_LABELS[tone].split(" — ")[0]}
                </p>
                <p
                  className={`mt-1 text-xs ${
                    league.tone === tone ? "text-mist-400" : "text-ink-950/50"
                  }`}
                >
                  {TONE_LABELS[tone].split(" — ")[1] ?? ""}
                </p>
              </button>
            ))}
          </div>
          {league.tone === "custom" && (
            <Input
              className="mt-3"
              value={league.toneCustom}
              onChange={(e) => update({ toneCustom: e.target.value })}
              placeholder="Describe the tone you want..."
            />
          )}
        </div>

        <div>
          <Label htmlFor="boundaries" hint="Optional">
            Anything off limits?
          </Label>
          <Textarea
            id="boundaries"
            value={league.boundaries}
            onChange={(e) => update({ boundaries: e.target.value })}
            placeholder="Topics, people, or moments Sunday Stories should never joke about."
          />
          <HelperText>
            Sunday Stories will never joke about anything your league doesn&rsquo;t want
            included — we&rsquo;ll respect this list every time we generate content.
          </HelperText>
        </div>
      </div>
    </StepShell>
  );
}
