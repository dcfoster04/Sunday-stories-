"use client";

import { StepShell } from "@/components/ui/StepShell";
import { Chip } from "@/components/ui/Chip";
import { Input, Label } from "@/components/ui/Field";
import { AnonymityToggle } from "../AnonymityToggle";
import type { SimpleOwner } from "../state";

export function StepOwnerQuestion({
  kicker,
  question,
  owners,
  selectedOwnerId,
  onSelectOwner,
  why,
  onWhyChange,
  onNext,
  onBack,
  anonymous,
  onAnonymousChange,
}: {
  kicker: string;
  question: string;
  owners: SimpleOwner[];
  selectedOwnerId: string;
  onSelectOwner: (id: string) => void;
  why: string;
  onWhyChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  anonymous?: boolean;
  onAnonymousChange?: (v: boolean) => void;
}) {
  return (
    <StepShell kicker={kicker} title={question} onBack={onBack} onNext={onNext} onSkip={onNext}>
      <div className="flex flex-wrap gap-2">
        {owners.map((o) => (
          <Chip
            key={o.id}
            selected={selectedOwnerId === o.id}
            onClick={() => onSelectOwner(selectedOwnerId === o.id ? "" : o.id)}
          >
            {o.ownerName}
          </Chip>
        ))}
      </div>
      {selectedOwnerId && (
        <div className="mt-5">
          <Label hint="Optional">Why?</Label>
          <Input value={why} onChange={(e) => onWhyChange(e.target.value)} placeholder="Explain yourself..." />
          {onAnonymousChange && (
            <AnonymityToggle anonymous={!!anonymous} onChange={onAnonymousChange} />
          )}
        </div>
      )}
    </StepShell>
  );
}
