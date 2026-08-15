"use client";

import { cn } from "@/lib/utils";

export function Chip({
  selected,
  onClick,
  children,
  disabled,
  className,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150",
        selected
          ? "border-flare-400 bg-flare-400 text-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]"
          : "border-ink-950/20 bg-white text-ink-950/70 hover:border-ink-950/50 hover:text-ink-950",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
