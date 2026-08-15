import { cn } from "@/lib/utils";
import { TICKER_HEADLINES } from "@/content/marketing";

export function HeadlineTicker({
  reverse = false,
  className,
}: {
  reverse?: boolean;
  className?: string;
}) {
  const items = [...TICKER_HEADLINES, ...TICKER_HEADLINES];
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)} aria-hidden="true">
      <div
        className={cn("inline-flex animate-ticker gap-10", reverse && "[animation-direction:reverse]")}
      >
        {items.map((headline, i) => (
          <span
            key={i}
            className="font-display text-sm font-bold uppercase tracking-wide text-mist-500"
          >
            {headline}
            <span className="ml-10 text-gold-400/60">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
