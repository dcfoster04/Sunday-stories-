import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xl border border-ink-950/10 bg-white px-4 py-3 text-[15px] text-ink-950 placeholder:text-ink-950/35 transition-colors focus:border-ink-950/30 focus:outline-none focus:ring-2 focus:ring-gold-400/50";

export function Label({
  children,
  htmlFor,
  hint,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className={cn("text-sm font-semibold text-ink-950", className)}>
        {children}
      </label>
      {hint && <span className="text-xs text-ink-950/45">{hint}</span>}
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, "min-h-28 resize-y", className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(controlBase, "appearance-none bg-white pr-10", className)} {...props}>
      {children}
    </select>
  );
}

export function HelperText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm leading-relaxed text-ink-950/50">{children}</p>;
}
