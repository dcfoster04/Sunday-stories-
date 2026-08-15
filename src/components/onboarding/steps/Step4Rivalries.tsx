"use client";

import { useState } from "react";
import { StepShell } from "@/components/ui/StepShell";
import { Label, Input } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import type { DraftOwner, DraftRivalry, OnboardingState } from "../state";
import { newClientId } from "../state";
import { RAPID_FIRE_PROMPTS, type RapidFireKey } from "@/lib/validation";

const RAPID_FIRE_ORDER = Object.keys(RAPID_FIRE_PROMPTS) as RapidFireKey[];

function NewRivalryForm({
  owners,
  onAdd,
}: {
  owners: DraftOwner[];
  onAdd: (rivalry: DraftRivalry) => void;
}) {
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  function submit() {
    if (!a || !b || a === b) return;
    onAdd({ clientId: newClientId(), ownerAClientId: a, ownerBClientId: b, reason });
    setA(null);
    setB(null);
    setReason("");
  }

  return (
    <div className="rounded-lg border border-dashed border-ink-950/20 bg-white p-5">
      <Label>Pick two rivals</Label>
      <div className="flex flex-wrap gap-2">
        {owners.map((o) => (
          <Chip
            key={o.clientId}
            selected={a === o.clientId || b === o.clientId}
            onClick={() => {
              if (a === o.clientId) setA(null);
              else if (b === o.clientId) setB(null);
              else if (!a) setA(o.clientId);
              else if (!b) setB(o.clientId);
            }}
            disabled={!a || !b ? false : a !== o.clientId && b !== o.clientId}
          >
            {o.ownerName || "Unnamed manager"}
          </Chip>
        ))}
      </div>
      <div className="mt-4">
        <Label hint="Optional">Why is this a rivalry?</Label>
        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="The trade nobody's forgiven. The championship that got away."
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={submit}
        disabled={!a || !b}
      >
        + Add rivalry
      </Button>
    </div>
  );
}

export function Step4Rivalries({
  owners,
  rivalries,
  setRivalries,
  rapidFire,
  setRapidFire,
  onNext,
  onBack,
}: {
  owners: DraftOwner[];
  rivalries: DraftRivalry[];
  setRivalries: (r: DraftRivalry[]) => void;
  rapidFire: OnboardingState["rapidFire"];
  setRapidFire: (r: OnboardingState["rapidFire"]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const nameFor = (clientId: string) =>
    owners.find((o) => o.clientId === clientId)?.ownerName || "Unnamed";

  return (
    <StepShell
      kicker="Step 4 of 5 — Rivalries & Drama"
      title="Where's the heat?"
      helper="Add any rivalries, then rapid-fire the league's reputation."
      onBack={onBack}
      onNext={onNext}
      onSkip={onNext}
    >
      {owners.length === 0 ? (
        <p className="rounded-xl bg-ink-950/5 p-4 text-sm text-ink-950/50">
          Add managers in Step 2 to set up rivalries and rapid-fire predictions — or skip
          this step for now.
        </p>
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            {rivalries.map((r) => (
              <div
                key={r.clientId}
                className="flex items-start justify-between gap-3 rounded-xl bg-ink-950/[0.03] p-4"
              >
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-ink-950">
                    {nameFor(r.ownerAClientId)} vs. {nameFor(r.ownerBClientId)}
                  </p>
                  {r.reason && <p className="mt-1 text-sm text-ink-950/55">{r.reason}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setRivalries(rivalries.filter((x) => x.clientId !== r.clientId))}
                  className="text-ink-950/30 hover:text-crimson-500"
                  aria-label="Remove rivalry"
                >
                  &times;
                </button>
              </div>
            ))}
            <NewRivalryForm owners={owners} onAdd={(r) => setRivalries([...rivalries, r])} />
          </div>

          <div>
            <p className="kicker mb-4 text-ink-950/40">Rapid fire</p>
            <div className="space-y-4">
              {RAPID_FIRE_ORDER.map((key) => (
                <div key={key}>
                  <p className="mb-2 text-sm font-medium text-ink-950">
                    {RAPID_FIRE_PROMPTS[key]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {owners.map((o) => (
                      <Chip
                        key={o.clientId}
                        selected={rapidFire[key] === o.clientId}
                        onClick={() =>
                          setRapidFire({
                            ...rapidFire,
                            [key]: rapidFire[key] === o.clientId ? undefined : o.clientId,
                          })
                        }
                      >
                        {o.ownerName || "Unnamed"}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </StepShell>
  );
}
