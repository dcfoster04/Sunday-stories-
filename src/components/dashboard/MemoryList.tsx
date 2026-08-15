"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { MEMORY_TYPE_LABELS, type MemoryType } from "@/lib/types";

export type DashboardMemory = {
  id: string;
  type: string;
  title: string;
  description: string;
  peopleInvolved: string[];
  seasonOrYear: string | null;
  importance: number;
  imageUrl: string | null;
};

export function MemoryList({
  memories,
  ownerNamesById,
  onDeleted,
  emptyTitle = "No lore yet",
  emptyDescription = "Add the first one above.",
}: {
  memories: DashboardMemory[];
  ownerNamesById: Record<string, string>;
  onDeleted: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function remove(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/dashboard/memories/${id}`, { method: "DELETE" });
    if (res.ok) onDeleted(id);
    setDeletingId(null);
  }

  if (memories.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {memories.map((m) => (
        <div
          key={m.id}
          className="rounded-lg border border-l-[3px] border-ink-950/8 border-l-flare-400 bg-white p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <Badge tone="outline">{MEMORY_TYPE_LABELS[m.type as MemoryType] ?? m.type}</Badge>
            <button
              onClick={() => remove(m.id)}
              disabled={deletingId === m.id}
              className="text-xs font-semibold text-ink-950/30 hover:text-crimson-500"
            >
              {deletingId === m.id ? "Removing..." : "Remove"}
            </button>
          </div>
          <h3 className="mt-3 font-display text-base font-bold text-ink-950">{m.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-950/60">{m.description}</p>
          {m.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.imageUrl} alt="" className="mt-3 max-h-40 rounded-lg object-cover" />
          )}
          {(m.peopleInvolved.length > 0 || m.seasonOrYear) && (
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ink-950/35">
              {m.peopleInvolved.map((id) => ownerNamesById[id] ?? "Unknown").join(", ")}
              {m.peopleInvolved.length > 0 && m.seasonOrYear ? " · " : ""}
              {m.seasonOrYear}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
