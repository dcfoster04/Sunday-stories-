"use client";

import { StepShell } from "@/components/ui/StepShell";
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
            className={`rounded-xl border p-4 text-left transition-colors ${
              value === owner.id
                ? "border-ink-950 bg-ink-950 text-paper-100"
                : "border-ink-950/12 bg-white text-ink-950 hover:border-ink-950/30"
            }`}
          >
            <p className="font-display text-sm font-bold">{owner.ownerName}</p>
            {owner.teamName && (
              <p
                className={`mt-1 text-xs ${
                  value === owner.id ? "text-mist-400" : "text-ink-950/45"
                }`}
              >
                {owner.teamName}
              </p>
            )}
          </button>
        ))}
      </div>
      {owners.length === 0 && (
        <p className="rounded-xl bg-ink-950/5 p-4 text-sm text-ink-950/50">
          This league hasn&rsquo;t added any managers yet — check with your
          commissioner.
        </p>
      )}
    </StepShell>
  );
}
