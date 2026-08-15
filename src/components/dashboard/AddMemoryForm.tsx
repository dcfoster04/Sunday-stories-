"use client";

import { useRef, useState } from "react";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { MEMORY_TYPES, MEMORY_TYPE_LABELS, type MemoryType } from "@/lib/types";
import type { DashboardMemory } from "./MemoryList";

type SimpleOwner = { id: string; ownerName: string };

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

export function AddMemoryForm({
  owners,
  allowedTypes = MEMORY_TYPES,
  defaultType,
  onCreated,
  triggerLabel = "+ Add to the Lore",
}: {
  owners: SimpleOwner[];
  allowedTypes?: readonly MemoryType[];
  defaultType?: MemoryType;
  onCreated: (memory: DashboardMemory) => void;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<MemoryType>(defaultType ?? allowedTypes[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [seasonOrYear, setSeasonOrYear] = useState("");
  const [importance, setImportance] = useState(2);
  const [attributionAllowed, setAttributionAllowed] = useState(true);
  const [canBeUsedForJokes, setCanBeUsedForJokes] = useState(true);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function reset() {
    setType(defaultType ?? allowedTypes[0]);
    setTitle("");
    setDescription("");
    setPeople([]);
    setSeasonOrYear("");
    setImportance(2);
    setAttributionAllowed(true);
    setCanBeUsedForJokes(true);
    setScreenshotDataUrl(undefined);
    setUploadError(null);
  }

  function handleFile(file: File) {
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setUploadError("That image is a bit large — try one under 5MB.");
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setScreenshotDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function submit() {
    setSaving(true);
    try {
      const res = await fetch("/api/dashboard/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          description,
          peopleInvolved: people,
          seasonOrYear,
          importance,
          attributionAllowed,
          canBeUsedForJokes,
          screenshotDataUrl,
        }),
      });
      if (res.ok) {
        const { memory } = await res.json();
        onCreated(memory);
        reset();
        setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="lg">
        {triggerLabel}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-ink-950/10 bg-white p-6">
      <div>
        <Label>What kind of lore is this?</Label>
        <div className="flex flex-wrap gap-2">
          {allowedTypes.map((t) => (
            <Chip key={t} selected={type === t} onClick={() => setType(t)}>
              {MEMORY_TYPE_LABELS[t]}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give it a headline" autoFocus />
      </div>

      <div className="mt-4">
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell the story."
          className="min-h-28"
        />
      </div>

      {owners.length > 0 && (
        <div className="mt-4">
          <Label hint="Optional">Who&rsquo;s involved?</Label>
          <div className="flex flex-wrap gap-2">
            {owners.map((o) => (
              <Chip
                key={o.id}
                selected={people.includes(o.id)}
                onClick={() =>
                  setPeople((p) => (p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id]))
                }
              >
                {o.ownerName}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label hint="Optional">Season / year</Label>
          <Input value={seasonOrYear} onChange={(e) => setSeasonOrYear(e.target.value)} placeholder="2023" />
        </div>
        <div>
          <Label>Importance</Label>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <Chip key={n} selected={importance === n} onClick={() => setImportance(n)}>
                {n === 1 ? "Minor" : n === 2 ? "Notable" : "Legendary"}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-950/15 bg-ink-950/[0.02] py-4 text-sm text-ink-950/50 hover:border-ink-950/30"
        >
          {screenshotDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={screenshotDataUrl} alt="preview" className="max-h-16 rounded" />
          ) : (
            "+ Attach a screenshot (optional)"
          )}
        </button>
        {uploadError && <p className="mt-1 text-xs text-crimson-500">{uploadError}</p>}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 border-t border-ink-950/8 pt-4 text-sm">
        <label className="flex items-center gap-2 text-ink-950/70">
          <input
            type="checkbox"
            checked={attributionAllowed}
            onChange={(e) => setAttributionAllowed(e.target.checked)}
          />
          Attribution allowed
        </label>
        <label className="flex items-center gap-2 text-ink-950/70">
          <input
            type="checkbox"
            checked={canBeUsedForJokes}
            onChange={(e) => setCanBeUsedForJokes(e.target.checked)}
          />
          Can be used for jokes
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={submit} disabled={saving || !title.trim() || !description.trim()}>
          {saving ? "Saving..." : "Add to the lore"}
        </Button>
      </div>
    </div>
  );
}
