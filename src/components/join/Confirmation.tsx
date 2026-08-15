import { Kicker } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

export function Confirmation({ leagueName }: { leagueName: string }) {
  return (
    <div className="mx-auto w-full max-w-lg text-center">
      <Reveal>
        <Kicker tone="crimson">Filed.</Kicker>
        <h1 className="mt-4 text-balance font-display text-3xl font-black uppercase leading-tight tracking-tight text-ink-950 sm:text-4xl">
          Sunday Stories has your statement on record.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-ink-950/55">
          {leagueName} is a little better understood now. We&rsquo;ll take it
          from here — thanks for the sources.
        </p>
      </Reveal>
    </div>
  );
}
