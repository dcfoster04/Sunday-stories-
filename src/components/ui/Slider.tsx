"use client";

import { formatSeriousness } from "@/lib/utils";

export function SeriousnessSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ss-range"
        aria-label="League seriousness"
      />
      <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-950/45">
        <span>Casual</span>
        <span className="font-display text-sm font-bold normal-case tracking-normal text-ink-950">
          {formatSeriousness(value)}
        </span>
        <span>We Have Problems</span>
      </div>
    </div>
  );
}
