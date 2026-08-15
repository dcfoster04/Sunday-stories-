"use client";

import { useState } from "react";
import { AddMemoryForm } from "./AddMemoryForm";
import { MemoryList, type DashboardMemory } from "./MemoryList";

export function ReceiptsPageClient({
  owners,
  ownerNamesById,
  memories: initialMemories,
}: {
  owners: { id: string; ownerName: string }[];
  ownerNamesById: Record<string, string>;
  memories: DashboardMemory[];
}) {
  const [memories, setMemories] = useState(initialMemories);

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="kicker text-ink-950/40">Receipts</p>
          <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tighter text-ink-950">
            Receipts
          </h1>
          <p className="mt-2 max-w-lg text-sm text-ink-950/55">
            Quotes and screenshots Sunday Stories can hold the league
            accountable to. Only add content you&rsquo;re comfortable
            incorporating into coverage.
          </p>
        </div>
        <AddMemoryForm
          owners={owners}
          allowedTypes={["QUOTE", "OTHER"]}
          defaultType="QUOTE"
          onCreated={(m) => setMemories((ms) => [m, ...ms])}
          triggerLabel="+ Add a receipt"
        />
      </div>

      <div className="mt-8">
        <MemoryList
          memories={memories}
          ownerNamesById={ownerNamesById}
          onDeleted={(id) => setMemories((ms) => ms.filter((m) => m.id !== id))}
          emptyTitle="No receipts yet"
          emptyDescription="Quotes and screenshots you add will show up here."
        />
      </div>
    </div>
  );
}
