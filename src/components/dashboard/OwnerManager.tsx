"use client";

import { useState } from "react";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { ARCHETYPES, MAX_ARCHETYPES_PER_OWNER } from "@/lib/types";

export type DashboardOwner = {
  id: string;
  ownerName: string;
  teamName: string | null;
  favoriteNflTeam: string | null;
  managerDescription: string | null;
  archetypes: string[];
  extraNotes: string | null;
};

type FormState = {
  ownerName: string;
  teamName: string;
  favoriteNflTeam: string;
  managerDescription: string;
  archetypes: string[];
  extraNotes: string;
};

function toForm(o: DashboardOwner): FormState {
  return {
    ownerName: o.ownerName,
    teamName: o.teamName ?? "",
    favoriteNflTeam: o.favoriteNflTeam ?? "",
    managerDescription: o.managerDescription ?? "",
    archetypes: o.archetypes,
    extraNotes: o.extraNotes ?? "",
  };
}

const BLANK: FormState = {
  ownerName: "",
  teamName: "",
  favoriteNflTeam: "",
  managerDescription: "",
  archetypes: [],
  extraNotes: "",
};

function OwnerEditor({
  initial,
  onSave,
  onDelete,
  onCancel,
  saveLabel = "Save",
}: {
  initial: FormState;
  onSave: (form: FormState) => Promise<void>;
  onDelete?: () => Promise<void>;
  onCancel?: () => void;
  saveLabel?: string;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function toggleArchetype(tag: string) {
    setForm((f) => {
      const has = f.archetypes.includes(tag);
      if (has) return { ...f, archetypes: f.archetypes.filter((a) => a !== tag) };
      if (f.archetypes.length >= MAX_ARCHETYPES_PER_OWNER) return f;
      return { ...f, archetypes: [...f.archetypes, tag] };
    });
  }

  return (
    <div className="rounded-lg border border-ink-950/10 bg-white p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
        </div>
        <div>
          <Label hint="Optional">Team name</Label>
          <Input value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} />
        </div>
      </div>
      <div className="mt-3">
        <Label hint="Optional">Favorite NFL team</Label>
        <Input
          value={form.favoriteNflTeam}
          onChange={(e) => setForm({ ...form, favoriteNflTeam: e.target.value })}
        />
      </div>
      <div className="mt-3">
        <Label hint="Optional">One thing we should know</Label>
        <Textarea
          value={form.managerDescription}
          onChange={(e) => setForm({ ...form, managerDescription: e.target.value })}
          className="min-h-20"
        />
      </div>
      <div className="mt-3">
        <Label hint={`Up to ${MAX_ARCHETYPES_PER_OWNER}`}>Personality tags</Label>
        <div className="flex flex-wrap gap-2">
          {ARCHETYPES.map((tag) => (
            <Chip
              key={tag}
              selected={form.archetypes.includes(tag)}
              onClick={() => toggleArchetype(tag)}
              disabled={!form.archetypes.includes(tag) && form.archetypes.length >= MAX_ARCHETYPES_PER_OWNER}
            >
              {tag}
            </Chip>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <Label hint="Optional">Anything else?</Label>
        <Input value={form.extraNotes} onChange={(e) => setForm({ ...form, extraNotes: e.target.value })} />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink-950/8 pt-4">
        {onDelete ? (
          <button
            type="button"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true);
              await onDelete();
            }}
            className="text-xs font-semibold text-crimson-500 hover:text-crimson-600"
          >
            {deleting ? "Removing..." : "Remove manager"}
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            size="sm"
            disabled={saving || !form.ownerName.trim()}
            onClick={async () => {
              setSaving(true);
              await onSave(form);
              setSaving(false);
            }}
          >
            {saving ? "Saving..." : saveLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function OwnerManager({ initialOwners }: { initialOwners: DashboardOwner[] }) {
  const [owners, setOwners] = useState(initialOwners);
  const [adding, setAdding] = useState(false);

  async function updateOwner(id: string, form: FormState) {
    const res = await fetch(`/api/dashboard/owners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { owner } = await res.json();
      setOwners((os) => os.map((o) => (o.id === id ? owner : o)));
    }
  }

  async function deleteOwner(id: string) {
    const res = await fetch(`/api/dashboard/owners/${id}`, { method: "DELETE" });
    if (res.ok) setOwners((os) => os.filter((o) => o.id !== id));
  }

  async function createOwner(form: FormState) {
    const res = await fetch("/api/dashboard/owners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { owner } = await res.json();
      setOwners((os) => [...os, owner]);
      setAdding(false);
    }
  }

  return (
    <div className="space-y-4">
      {owners.map((owner) => (
        <OwnerEditor
          key={owner.id}
          initial={toForm(owner)}
          onSave={(form) => updateOwner(owner.id, form)}
          onDelete={() => deleteOwner(owner.id)}
        />
      ))}

      {adding ? (
        <OwnerEditor
          initial={BLANK}
          onSave={createOwner}
          onCancel={() => setAdding(false)}
          saveLabel="Add manager"
        />
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)} className="w-full border-dashed">
          + Add a manager
        </Button>
      )}

      {owners.length === 0 && !adding && (
        <p className="text-center text-sm text-ink-950/40">No managers yet.</p>
      )}
    </div>
  );
}
