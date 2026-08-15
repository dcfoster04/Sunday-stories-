"use client";

import { useState } from "react";
import { StepShell } from "@/components/ui/StepShell";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DraftOwner } from "../state";
import { newOwner } from "../state";
import { ARCHETYPES, MAX_ARCHETYPES_PER_OWNER } from "@/lib/types";

function OwnerCard({
  owner,
  index,
  onChange,
  onRemove,
}: {
  owner: DraftOwner;
  index: number;
  onChange: (patch: Partial<DraftOwner>) => void;
  onRemove: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  function toggleArchetype(tag: string) {
    const has = owner.archetypes.includes(tag);
    if (has) {
      onChange({ archetypes: owner.archetypes.filter((a) => a !== tag) });
    } else if (owner.archetypes.length < MAX_ARCHETYPES_PER_OWNER) {
      onChange({ archetypes: [...owner.archetypes, tag] });
    }
  }

  return (
    <div className="rounded-lg border border-ink-950/10 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Input
            value={owner.ownerName}
            onChange={(e) => onChange({ ownerName: e.target.value })}
            placeholder={`Manager ${index + 1} name`}
            className="border-none px-0 py-0 font-display text-lg font-bold shadow-none focus:ring-0"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove manager"
          className="mt-1 text-ink-950/30 transition-colors hover:text-crimson-500"
        >
          &times;
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label hint="Optional">Team name</Label>
              <Input
                value={owner.teamName}
                onChange={(e) => onChange({ teamName: e.target.value })}
                placeholder="The Gridiron Regretters"
              />
            </div>
            <div>
              <Label hint="Optional">Favorite NFL team</Label>
              <Input
                value={owner.favoriteNflTeam}
                onChange={(e) => onChange({ favoriteNflTeam: e.target.value })}
                placeholder="Seahawks"
              />
            </div>
          </div>

          <div>
            <Label hint="Optional">One thing we should know about this person</Label>
            <Textarea
              value={owner.managerDescription}
              onChange={(e) => onChange({ managerDescription: e.target.value })}
              placeholder="Seahawks homer. Overvalues rookies. Talks enormous amounts of trash despite never winning anything."
              className="min-h-20"
            />
          </div>

          <div>
            <Label hint={`Up to ${MAX_ARCHETYPES_PER_OWNER}`}>Personality tags</Label>
            <div className="flex flex-wrap gap-2">
              {ARCHETYPES.map((tag) => (
                <Chip
                  key={tag}
                  selected={owner.archetypes.includes(tag)}
                  onClick={() => toggleArchetype(tag)}
                  disabled={
                    !owner.archetypes.includes(tag) &&
                    owner.archetypes.length >= MAX_ARCHETYPES_PER_OWNER
                  }
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <Label hint="Optional">Anything else?</Label>
            <Input
              value={owner.extraNotes}
              onChange={(e) => onChange({ extraNotes: e.target.value })}
              placeholder="Anything else Sunday Stories should know"
            />
          </div>

          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-xs font-semibold text-ink-950/40 hover:text-ink-950"
          >
            Collapse
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 text-sm text-ink-950/45 hover:text-ink-950"
        >
          {owner.teamName || owner.managerDescription
            ? `${owner.teamName ? `"${owner.teamName}" · ` : ""}${owner.archetypes.join(", ") || "Add details"}`
            : "Add team, tags, and details"}
        </button>
      )}
    </div>
  );
}

export function Step2Characters({
  owners,
  setOwners,
  onNext,
  onBack,
}: {
  owners: DraftOwner[];
  setOwners: (owners: DraftOwner[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function addOwner() {
    setOwners([...owners, newOwner()]);
  }

  function updateOwner(clientId: string, patch: Partial<DraftOwner>) {
    setOwners(owners.map((o) => (o.clientId === clientId ? { ...o, ...patch } : o)));
  }

  function removeOwner(clientId: string) {
    setOwners(owners.filter((o) => o.clientId !== clientId));
  }

  return (
    <StepShell
      kicker="Step 2 of 5 — Meet the Characters"
      title="Who's in this league?"
      helper="Add your owners. We'll ask the rest of the league to help fill in the details, so don't worry about being thorough."
      onBack={onBack}
      onNext={onNext}
      onSkip={owners.length === 0 ? onNext : undefined}
    >
      <div className="space-y-4">
        {owners.map((owner, i) => (
          <OwnerCard
            key={owner.clientId}
            owner={owner}
            index={i}
            onChange={(patch) => updateOwner(owner.clientId, patch)}
            onRemove={() => removeOwner(owner.clientId)}
          />
        ))}

        <Button variant="outline" onClick={addOwner} className="w-full border-dashed">
          + Add a manager
        </Button>

        {owners.length === 0 && (
          <EmptyState
            title="No managers added yet"
            description="Add your owners above — we'll ask the rest of the league to help fill in the details, so don't worry about being thorough."
          />
        )}
      </div>
    </StepShell>
  );
}
