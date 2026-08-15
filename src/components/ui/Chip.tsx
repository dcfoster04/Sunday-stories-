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
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150",
        selected
          ? "border-ink-950 bg-ink-950 text-paper-100"
          : "border-ink-950/15 bg-white text-ink-950/70 hover:border-ink-950/40 hover:text-ink-950",
        disabled && "cursor-not-allowed opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}
