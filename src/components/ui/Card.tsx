import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-950/8 bg-white p-6 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Kicker({
  children,
  tone = "ink",
  className,
}: {
  children: React.ReactNode;
  tone?: "ink" | "gold" | "crimson" | "paper";
  className?: string;
}) {
  const colors: Record<string, string> = {
    ink: "text-ink-950/60",
    gold: "text-gold-600",
    crimson: "text-crimson-500",
    paper: "text-paper-300",
  };
  return <span className={cn("kicker", colors[tone], className)}>{children}</span>;
}
