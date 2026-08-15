"use client";

import { StepShell } from "@/components/ui/StepShell";
import { Chip } from "@/components/ui/Chip";
import { MEMBER_RAPID_FIRE_PROMPTS } from "@/lib/validation";
import type { SimpleOwner } from "../state";

const ORDER = Object.keys(MEMBER_RAPID_FIRE_PROMPTS);

export function StepRapidFire({
  owners,
  rapidFire,
  setRapidFire,
  onNext,
  onBack,
  submitting,
}: {
  owners: SimpleOwner[];
  rapidFire: Record<string, string>;
  setRapidFire: (r: Record<string, string>) => void;
  onNext: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  return (
    <StepShell
      kicker="Rapid fire"
      title="Who is most likely to&hellip;"
      helper="Optional, but this is the good part."
      onBack={onBack}
      onNext={onNext}
      onSkip={onNext}
      nextLabel={submitting ? "Submitting..." : "Submit"}
      nextDisabled={submitting}
    >
      <div className="space-y-5">
        {ORDER.map((key) => (
          <div key={key}>
            <p className="mb-2 text-sm font-medium text-ink-950">
              {MEMBER_RAPID_FIRE_PROMPTS[key]}
            </p>
            <div className="flex flex-wrap gap-2">
              {owners.map((o) => (
                <Chip
                  key={o.id}
                  selected={rapidFire[key] === o.id}
                  onClick={() =>
                    setRapidFire({ ...rapidFire, [key]: rapidFire[key] === o.id ? "" : o.id })
                  }
                >
                  {o.ownerName}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </StepShell>
  );
}
