"use client";

import { StepShell } from "@/components/ui/StepShell";
import { EmptyState } from "@/components/ui/EmptyState";
import type { SimpleOwner } from "../state";

export function StepWhoAreYou({
  owners,
  value,
  onChange,
  onNext,
}: {
  owners: SimpleOwner[];
  value: string;
  onChange: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <StepShell
      kicker="First things first"
      title="Which one are you?"
      onNext={onNext}
      nextDisabled={!value}
      hideBack
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {owners.map((owner) => (
          <button
            key={owner.id}
            type="button"
            onClick={() => onChange(owner.id)}
            className={`rounded-lg border p-4 text-left transition-colors ${
              value === owner.id
                ? "border-flare-400 bg-flare-400 text-ink-950 shadow-[0_1px_0_rgba(255,255,255,0.35)_inset]"
                : "border-ink-950/15 bg-white text-ink-950 hover:border-ink-950/35"
            }`}
          >
            <p className="font-display text-sm font-bold">{owner.ownerName}</p>
            {owner.teamName && (
              <p
                className={`mt-1 text-xs ${
                  value === owner.id ? "text-ink-950/60" : "text-ink-950/45"
                }`}
              >
                {owner.teamName}
              </p>
            )}
          </button>
        ))}
      </div>
      {owners.length === 0 && (
        <EmptyState
          title="No managers yet"
          description="This league hasn't added any managers yet — check with your commissioner."
        />
      )}
    </StepShell>
  );
}
