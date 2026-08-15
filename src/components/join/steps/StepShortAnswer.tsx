"use client";

import { StepShell } from "@/components/ui/StepShell";
import { Textarea } from "@/components/ui/Field";
import { AnonymityToggle } from "../AnonymityToggle";

export function StepShortAnswer({
  kicker,
  question,
  helper,
  placeholder,
  value,
  onChange,
  onNext,
  onBack,
  anonymous,
  onAnonymousChange,
}: {
  kicker: string;
  question: string;
  helper?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  anonymous?: boolean;
  onAnonymousChange?: (v: boolean) => void;
}) {
  return (
    <StepShell
      kicker={kicker}
      title={question}
      helper={helper}
      onBack={onBack}
      onNext={onNext}
      onSkip={onNext}
    >
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-32"
        autoFocus
      />
      {onAnonymousChange && value.trim() && (
        <AnonymityToggle anonymous={!!anonymous} onChange={onAnonymousChange} />
      )}
    </StepShell>
  );
}
