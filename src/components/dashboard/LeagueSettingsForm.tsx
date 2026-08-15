"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label, Input, Select, Textarea } from "@/components/ui/Field";
import { SeriousnessSlider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import {
  LEAGUE_AGES,
  LEAGUE_AGE_LABELS,
  PLATFORMS,
  PLATFORM_LABELS,
  TONES,
  TONE_LABELS,
  type Platform,
  type LeagueAge,
  type Tone,
} from "@/lib/types";

type LeagueFormData = {
  leagueName: string;
  platform: Platform;
  leagueAge: LeagueAge;
  seriousness: number;
  tone: Tone;
  toneCustom: string;
  boundaries: string;
};

export function LeagueSettingsForm({ league }: { league: LeagueFormData }) {
  const router = useRouter();
  const [form, setForm] = useState(league);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(patch: Partial<LeagueFormData>) {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/league", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Couldn't save those changes.");
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-lg border border-ink-950/8 bg-white p-6">
      <div>
        <Label htmlFor="leagueName">League name</Label>
        <Input id="leagueName" value={form.leagueName} onChange={(e) => update({ leagueName: e.target.value })} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Select
            id="platform"
            value={form.platform}
            onChange={(e) => update({ platform: e.target.value as Platform })}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLATFORM_LABELS[p]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="leagueAge">League age</Label>
          <Select
            id="leagueAge"
            value={form.leagueAge}
            onChange={(e) => update({ leagueAge: e.target.value as LeagueAge })}
          >
            {LEAGUE_AGES.map((a) => (
              <option key={a} value={a}>
                {LEAGUE_AGE_LABELS[a]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label>Seriousness</Label>
        <SeriousnessSlider value={form.seriousness} onChange={(v) => update({ seriousness: v })} />
      </div>

      <div>
        <Label htmlFor="tone">Tone</Label>
        <Select id="tone" value={form.tone} onChange={(e) => update({ tone: e.target.value as Tone })}>
          {TONES.map((t) => (
            <option key={t} value={t}>
              {TONE_LABELS[t]}
            </option>
          ))}
        </Select>
        {form.tone === "custom" && (
          <Input
            className="mt-3"
            value={form.toneCustom}
            onChange={(e) => update({ toneCustom: e.target.value })}
            placeholder="Describe the tone..."
          />
        )}
      </div>

      <div>
        <Label htmlFor="boundaries" hint="Optional">
          Off-limits topics
        </Label>
        <Textarea
          id="boundaries"
          value={form.boundaries}
          onChange={(e) => update({ boundaries: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-ink-950/8 pt-5">
        {error && <p className="text-sm text-crimson-500">{error}</p>}
        {saved && !error && <p className="text-sm text-ivy-500">Saved.</p>}
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
