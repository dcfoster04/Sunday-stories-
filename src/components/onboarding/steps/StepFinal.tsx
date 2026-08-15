"use client";

import { Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function StepFinal({
  value,
  onChange,
  onSubmit,
  onBack,
  submitting,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <p className="kicker text-flare-600">One last thing.</p>
      <h1 className="mx-auto mt-3 max-w-xl text-balance font-display text-3xl font-black leading-tight tracking-tighter text-ink-950 sm:text-4xl">
        If Sunday Stories were sitting at the bar with your league, what would
        it need to know to fit in?
      </h1>
      <div className="mt-8 text-left">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Anything at all. The inside jokes, the unwritten rules, the thing nobody explains to new members..."
          className="min-h-48"
          autoFocus
        />
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-ink-950/60" disabled={submitting}>
          &larr; Back
        </Button>
        <Button variant="dark" size="lg" onClick={onSubmit} disabled={submitting}>
          {submitting ? "Meeting your league..." : "Meet Sunday Stories"}
        </Button>
      </div>
    </div>
  );
}
