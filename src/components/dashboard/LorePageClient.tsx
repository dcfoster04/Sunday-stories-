"use client";

import { useState } from "react";
import { AddMemoryForm } from "./AddMemoryForm";
import { MemoryList, type DashboardMemory } from "./MemoryList";
import { SubmissionsInbox, type DashboardSubmission } from "./SubmissionsInbox";

export function LorePageClient({
  owners,
  ownerNamesById,
  memories: initialMemories,
  submissions,
}: {
  owners: { id: string; ownerName: string }[];
  ownerNamesById: Record<string, string>;
  memories: DashboardMemory[];
  submissions: DashboardSubmission[];
}) {
  const [memories, setMemories] = useState(initialMemories);
  const unreviewedCount = submissions.filter((s) => !s.reviewedByCommissioner).length;

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="kicker text-ink-950/40">Lore</p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-ink-950">
            League Lore
          </h1>
          <p className="mt-2 text-sm text-ink-950/55">
            Trades, collapses, running jokes — everything Sunday Stories draws
            from when it writes.
          </p>
        </div>
        <AddMemoryForm owners={owners} onCreated={(m) => setMemories((ms) => [m, ...ms])} />
      </div>

      <div className="mt-8">
        <MemoryList
          memories={memories}
          ownerNamesById={ownerNamesById}
          onDeleted={(id) => setMemories((ms) => ms.filter((m) => m.id !== id))}
        />
      </div>

      <div className="mt-16 border-t border-ink-950/8 pt-10">
        <p className="kicker text-ink-950/40">
          Member submissions{unreviewedCount > 0 ? ` · ${unreviewedCount} new` : ""}
        </p>
        <h2 className="mt-2 font-display text-2xl font-black uppercase tracking-tight text-ink-950">
          What the league is saying
        </h2>
        <p className="mt-2 text-sm text-ink-950/55">
          Raw answers from your contribution link. Turn anything useful into
          lore above.
        </p>
        <div className="mt-6">
          <SubmissionsInbox initialSubmissions={submissions} ownerNamesById={ownerNamesById} />
        </div>
      </div>
    </div>
  );
}
