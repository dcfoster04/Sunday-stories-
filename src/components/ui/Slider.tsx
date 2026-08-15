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
        style={{
          // Hard two-stop "gradient" = a flat fill up to `value`, not a
          // blended gradient — the standard cross-browser trick for
          // filling a native <input type="range"> track. Firefox fills
          // via ::-moz-range-progress in globals.css instead.
          background: `linear-gradient(to right, var(--color-flare-400) ${value}%, var(--color-ink-800) ${value}%)`,
        }}
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
