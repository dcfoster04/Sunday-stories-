import { cn } from "@/lib/utils";

export function ProgressBar({
  step,
  total,
  labels,
}: {
  step: number;
  total: number;
  labels?: string[];
}) {
  const pct = Math.round((step / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-950/45">
        <span>
          Step {step} of {total}
        </span>
        {labels?.[step - 1] && <span className="text-ink-950/70">{labels[step - 1]}</span>}
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-950/8">
        <div
          className="h-full rounded-full bg-flare-400 transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i + 1 === step ? "w-6 bg-flare-400" : i + 1 < step ? "w-1.5 bg-ink-950/50" : "w-1.5 bg-ink-950/15",
          )}
        />
      ))}
    </div>
  );
}
