import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold uppercase tracking-wide transition-all duration-200 ease-out disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants = {
  primary:
    "bg-flare-400 text-ink-950 hover:bg-flare-300 active:scale-[0.98] shadow-[0_1px_0_rgba(255,255,255,0.35)_inset] focus-visible:ring-flare-500 focus-visible:ring-offset-ink-950",
  dark: "bg-ink-950 text-paper-100 hover:bg-ink-800 active:scale-[0.98] focus-visible:ring-ink-950 focus-visible:ring-offset-paper-100",
  outline:
    "border border-current text-inherit hover:bg-black/[0.04] active:scale-[0.98] focus-visible:ring-current",
  ghost: "text-inherit hover:bg-black/[0.04] active:scale-[0.98] focus-visible:ring-current",
};

const sizes = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-12 px-6 text-xs",
  lg: "h-14 px-8 text-sm",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function ButtonLink({
  href,
  external,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: Route | string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external || /^https?:\/\//.test(href)) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href as Route} className={classes}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}
