import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function StepShell({
  kicker,
  title,
  helper,
  children,
  onBack,
  onNext,
  onSkip,
  nextLabel = "Continue",
  nextDisabled,
  backLabel = "Back",
  hideBack,
}: {
  kicker: string;
  title: React.ReactNode;
  helper?: React.ReactNode;
  children: React.ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
  hideBack?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="kicker text-flare-600">{kicker}</p>
      <h1 className="mt-3 text-balance font-display text-3xl font-black leading-tight tracking-tight text-ink-950 sm:text-4xl">
        {title}
      </h1>
      {helper && <p className="mt-3 text-[15px] leading-relaxed text-ink-950/55">{helper}</p>}

      <div className="mt-8">{children}</div>

      {(onBack || onNext || onSkip) && (
        <div
          className={cn(
            "mt-10 flex items-center gap-3",
            hideBack ? "justify-end" : "justify-between",
          )}
        >
          {onBack && !hideBack ? (
            <Button variant="ghost" onClick={onBack} className="text-ink-950/60">
              &larr; {backLabel}
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            {onSkip && (
              <Button variant="ghost" onClick={onSkip} className="text-ink-950/45">
                Skip
              </Button>
            )}
            {onNext && (
              <Button variant="dark" onClick={onNext} disabled={nextDisabled}>
                {nextLabel} &rarr;
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
