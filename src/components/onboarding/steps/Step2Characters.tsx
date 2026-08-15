"use client";

import { useEffect, useRef, useState } from "react";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import type { DraftOwner } from "../state";
import { newOwner } from "../state";
import { ARCHETYPES, MAX_ARCHETYPES_PER_OWNER } from "@/lib/types";

/**
 * Two-stage manager entry: a fast, spreadsheet-like roster list first
 * (names + optional team names only), then one focused quick-profile card
 * per manager. Keeps a 10-12 person league from turning into ten long
 * forms stacked on one page.
 */
type Substage = "roster" | "profiles" | "done";

function splitRosterLine(line: string): { name: string; team: string } {
  if (line.includes("\t")) {
    const [name, ...rest] = line.split("\t");
    return { name: name.trim(), team: rest.join(" ").trim() };
  }
  const dashMatch = line.match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (dashMatch) return { name: dashMatch[1].trim(), team: dashMatch[2].trim() };
  if (line.includes(",")) {
    const [name, ...rest] = line.split(",");
    return { name: name.trim(), team: rest.join(",").trim() };
  }
  return { name: line.trim(), team: "" };
}

function RosterStage({
  owners,
  setOwners,
  onNext,
  onBack,
  onSkipAll,
}: {
  owners: DraftOwner[];
  setOwners: (owners: DraftOwner[]) => void;
  onNext: () => void;
  onBack: () => void;
  onSkipAll?: () => void;
}) {
  const nameRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());
  const focusIdRef = useRef<string | null>(null);
  const seeded = useRef(false);

  // Land on the step with one blank row already waiting — no click required
  // before you can start typing.
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    if (owners.length === 0) {
      const owner = newOwner();
      focusIdRef.current = owner.clientId;
      setOwners([owner]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!focusIdRef.current) return;
    nameRefs.current.get(focusIdRef.current)?.focus();
    focusIdRef.current = null;
  }, [owners]);

  function addRow(focus = true) {
    const owner = newOwner();
    if (focus) focusIdRef.current = owner.clientId;
    setOwners([...owners, owner]);
    return owner;
  }

  function updateRow(clientId: string, patch: Partial<DraftOwner>) {
    setOwners(owners.map((o) => (o.clientId === clientId ? { ...o, ...patch } : o)));
  }

  function removeRow(clientId: string) {
    setOwners(owners.filter((o) => o.clientId !== clientId));
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === owners.length - 1) {
        addRow();
      } else {
        nameRefs.current.get(owners[index + 1].clientId)?.focus();
      }
    } else if (
      e.key === "Backspace" &&
      index > 0 &&
      owners[index].ownerName === "" &&
      owners[index].teamName === ""
    ) {
      e.preventDefault();
      const prev = owners[index - 1];
      removeRow(owners[index].clientId);
      focusIdRef.current = prev.clientId;
    }
  }

  function handleTeamKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index === owners.length - 1) {
        addRow();
      } else {
        nameRefs.current.get(owners[index + 1].clientId)?.focus();
      }
    }
  }

  function handleNamePaste(e: React.ClipboardEvent<HTMLInputElement>, index: number) {
    const text = e.clipboardData.getData("text");
    if (!text.includes("\n") && !text.includes("\t")) return;
    e.preventDefault();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    const rows = lines.map(splitRosterLine);
    const next = [...owners];
    next[index] = {
      ...next[index],
      ownerName: rows[0].name,
      teamName: rows[0].team || next[index].teamName,
    };
    const inserted = rows.slice(1).map((r) => ({ ...newOwner(), ownerName: r.name, teamName: r.team }));
    next.splice(index + 1, 0, ...inserted);
    setOwners(next);
    focusIdRef.current = inserted.length ? inserted[inserted.length - 1].clientId : next[index].clientId;
  }

  const namedCount = owners.filter((o) => o.ownerName.trim().length > 0).length;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <p className="kicker text-flare-600">Step 2 of 5 — Meet the Characters</p>
      <h1 className="mt-3 text-balance font-display text-3xl font-black leading-tight tracking-tight text-ink-950 sm:text-4xl">
        Build your roster.
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-950/55">
        Just names for now — hit Enter to add the next manager, or paste a
        whole list at once. You&rsquo;ll add the fun details next, one manager
        at a time.
      </p>

      <div className="mt-8 space-y-2">
        {owners.map((owner, i) => (
          <div key={owner.clientId} className="flex items-center gap-2">
            <span className="w-5 shrink-0 text-right text-xs font-semibold tabular-nums text-ink-950/25">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Input
                ref={(el) => {
                  nameRefs.current.set(owner.clientId, el);
                }}
                value={owner.ownerName}
                onChange={(e) => updateRow(owner.clientId, { ownerName: e.target.value })}
                onKeyDown={(e) => handleNameKeyDown(e, i)}
                onPaste={(e) => handleNamePaste(e, i)}
                placeholder={`Manager ${i + 1} name`}
              />
            </div>
            <div className="w-24 shrink-0 sm:w-40">
              <Input
                value={owner.teamName}
                onChange={(e) => updateRow(owner.clientId, { teamName: e.target.value })}
                onKeyDown={(e) => handleTeamKeyDown(e, i)}
                placeholder="Team"
              />
            </div>
            <button
              type="button"
              onClick={() => removeRow(owner.clientId)}
              aria-label="Remove manager"
              className="flex h-12 w-6 shrink-0 items-center justify-center text-lg text-ink-950/30 transition-colors hover:text-crimson-500"
            >
              &times;
            </button>
          </div>
        ))}

        <div className="flex items-center gap-2 pt-1">
          <span className="w-5 shrink-0" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => addRow()}
            className="border-dashed text-ink-950/70"
          >
            + Add manager
          </Button>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack} className="text-ink-950/60">
          &larr; Back
        </Button>
        <div className="flex items-center gap-3">
          {onSkipAll && (
            <Button variant="ghost" onClick={onSkipAll} className="text-ink-950/45">
              Skip
            </Button>
          )}
          <Button variant="dark" onClick={onNext} disabled={namedCount === 0}>
            Meet the Managers &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}

function ProfileStage({
  owner,
  index,
  total,
  onFieldChange,
  onToggleArchetype,
  onNext,
  onSkip,
  onBack,
}: {
  owner: DraftOwner;
  index: number;
  total: number;
  onFieldChange: (patch: Partial<DraftOwner>) => void;
  onToggleArchetype: (tag: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  const name = owner.ownerName.trim() || "This manager";
  const isLast = index + 1 === total;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink-950/8">
        <div
          className="h-full rounded-full bg-flare-400 transition-[width] duration-500 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <p className="kicker mt-6 text-flare-600">Step 2 of 5 — Meet the Characters</p>
      <h1 className="mt-3 flex flex-wrap items-baseline gap-x-3 text-balance font-display text-3xl font-black leading-tight tracking-tight text-ink-950 sm:text-4xl">
        {name}
        <span className="text-lg font-semibold text-ink-950/35 sm:text-xl">
          — {index + 1} of {total}
        </span>
      </h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-950/55">
        Quick hits only — everything below is optional. The more you share,
        the sharper the coverage.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <Label hint="Optional">Favorite NFL team</Label>
          <Input
            value={owner.favoriteNflTeam}
            onChange={(e) => onFieldChange({ favoriteNflTeam: e.target.value })}
            placeholder="Seahawks"
            autoFocus
          />
        </div>

        <div>
          <Label>One thing Sunday Stories should know about {name}</Label>
          <Textarea
            value={owner.managerDescription}
            onChange={(e) => onFieldChange({ managerDescription: e.target.value })}
            placeholder="Seahawks homer. Overvalues rookies. Talks enormous amounts of trash despite never winning anything."
            className="min-h-24"
          />
        </div>

        <div>
          <Label hint={`Up to ${MAX_ARCHETYPES_PER_OWNER}`}>Personality tags</Label>
          <div className="flex flex-wrap gap-2">
            {ARCHETYPES.map((tag) => (
              <Chip
                key={tag}
                selected={owner.archetypes.includes(tag)}
                onClick={() => onToggleArchetype(tag)}
                disabled={
                  !owner.archetypes.includes(tag) && owner.archetypes.length >= MAX_ARCHETYPES_PER_OWNER
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
            onChange={(e) => onFieldChange({ extraNotes: e.target.value })}
            placeholder="Anything else Sunday Stories should know"
          />
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack} className="text-ink-950/60">
          &larr; Back
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onSkip} className="text-ink-950/45">
            Skip — we&rsquo;ll ask {name}
          </Button>
          <Button variant="dark" onClick={onNext}>
            {isLast ? "Finish profiles" : "Next manager"} &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}

function DoneStage({
  ownerCount,
  onContinue,
  onBack,
}: {
  ownerCount: number;
  onContinue: () => void;
  onBack: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl text-center">
      <p className="kicker text-flare-600">Step 2 of 5 — Meet the Characters</p>
      <h1 className="mt-3 text-balance font-display text-3xl font-black leading-tight tracking-tight text-ink-950 sm:text-4xl">
        You&rsquo;ve given us enough to get started.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink-950/55">
        {ownerCount > 0
          ? `That's ${ownerCount} manager${ownerCount === 1 ? "" : "s"} on the roster. `
          : "No managers on the roster yet — that's okay. "}
        Once your league is live, we&rsquo;ll invite everyone to add their own
        context, quotes, and rivalries themselves — so nothing here needed to
        be complete.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button variant="ghost" onClick={onBack} className="text-ink-950/60">
          &larr; Back
        </Button>
        <Button variant="dark" onClick={onContinue}>
          Continue &rarr;
        </Button>
      </div>
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
  const [substage, setSubstage] = useState<Substage>("roster");
  const [profileIndex, setProfileIndex] = useState(0);

  const namedOwners = owners.filter((o) => o.ownerName.trim().length > 0);

  function enterProfiles() {
    if (namedOwners.length !== owners.length) setOwners(namedOwners);
    setProfileIndex(0);
    setSubstage(namedOwners.length > 0 ? "profiles" : "done");
  }

  function updateOwner(clientId: string, patch: Partial<DraftOwner>) {
    setOwners(owners.map((o) => (o.clientId === clientId ? { ...o, ...patch } : o)));
  }

  function toggleArchetype(owner: DraftOwner, tag: string) {
    const has = owner.archetypes.includes(tag);
    if (has) {
      updateOwner(owner.clientId, { archetypes: owner.archetypes.filter((a) => a !== tag) });
    } else if (owner.archetypes.length < MAX_ARCHETYPES_PER_OWNER) {
      updateOwner(owner.clientId, { archetypes: [...owner.archetypes, tag] });
    }
  }

  function advance() {
    if (profileIndex + 1 < namedOwners.length) {
      setProfileIndex((i) => i + 1);
    } else {
      setSubstage("done");
    }
  }

  function retreat() {
    if (profileIndex > 0) {
      setProfileIndex((i) => i - 1);
    } else {
      setSubstage("roster");
    }
  }

  if (substage === "roster") {
    return (
      <RosterStage
        owners={owners}
        setOwners={setOwners}
        onBack={onBack}
        onNext={enterProfiles}
        onSkipAll={namedOwners.length === 0 ? onNext : undefined}
      />
    );
  }

  if (substage === "profiles" && namedOwners.length > 0) {
    const owner = namedOwners[Math.min(profileIndex, namedOwners.length - 1)];
    return (
      <ProfileStage
        owner={owner}
        index={profileIndex}
        total={namedOwners.length}
        onFieldChange={(patch) => updateOwner(owner.clientId, patch)}
        onToggleArchetype={(tag) => toggleArchetype(owner, tag)}
        onNext={advance}
        onSkip={advance}
        onBack={retreat}
      />
    );
  }

  return (
    <DoneStage
      ownerCount={namedOwners.length}
      onContinue={onNext}
      onBack={() => setSubstage(namedOwners.length > 0 ? "profiles" : "roster")}
    />
  );
}
