import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-ink-950/20 bg-transparent px-6 py-10 text-center",
        className,
      )}
    >
      <p className="font-display text-sm font-bold uppercase tracking-[0.1em] text-ink-950/35">
        {title}
      </p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-950/45">
          {description}
        </p>
      )}
    </div>
  );
}
