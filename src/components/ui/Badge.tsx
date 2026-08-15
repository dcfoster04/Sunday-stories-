import { cn } from "@/lib/utils";

const tones = {
  /* high-emphasis — the one vivid accent, filled */
  flare: "bg-flare-400 text-ink-950",
  /* neutral type/category label — outlined, quiet */
  outline: "border border-ink-950/25 text-ink-950/70",
  /* for badges sitting on a dark surface */
  dark: "bg-paper-100 text-ink-950",
  /* destructive/attention-needed only */
  crimson: "bg-crimson-500 text-paper-100",
};

export function Badge({
  children,
  tone = "outline",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.1em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
