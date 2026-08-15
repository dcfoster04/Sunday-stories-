"use client";

import { useRef, useState } from "react";
import { StepShell } from "@/components/ui/StepShell";
import { Label, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { DraftReceipt } from "../state";
import { newClientId } from "../state";

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;

function emptyDraft(kind: DraftReceipt["kind"]): DraftReceipt {
  return {
    clientId: newClientId(),
    kind,
    quoteText: "",
    quoteBy: "",
    quoteDate: "",
    quoteContext: "",
    momentTitle: "",
    momentDescription: "",
    screenshotCaption: "",
  };
}

function ReceiptRow({
  receipt,
  onRemove,
}: {
  receipt: DraftReceipt;
  onRemove: () => void;
}) {
  const label =
    receipt.kind === "quote"
      ? `"${receipt.quoteText}"${receipt.quoteBy ? ` — ${receipt.quoteBy}` : ""}`
      : receipt.kind === "moment"
        ? receipt.momentTitle
        : receipt.screenshotCaption || "Screenshot";

  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-ink-950/[0.03] p-4">
      <div className="min-w-0">
        <p className="kicker text-ink-950/35">{receipt.kind}</p>
        <p className="mt-1 truncate text-sm text-ink-950/75">{label || "(empty)"}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 text-ink-950/30 hover:text-crimson-500"
        aria-label="Remove receipt"
      >
        &times;
      </button>
    </div>
  );
}

export function Step5Receipts({
  receipts,
  setReceipts,
  onNext,
  onBack,
}: {
  receipts: DraftReceipt[];
  setReceipts: (r: DraftReceipt[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [adding, setAdding] = useState<DraftReceipt["kind"] | null>(null);
  const [draft, setDraft] = useState<DraftReceipt>(emptyDraft("quote"));
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  function startAdding(kind: DraftReceipt["kind"]) {
    setDraft(emptyDraft(kind));
    setAdding(kind);
    setUploadError(null);
  }

  function save() {
    setReceipts([...receipts, draft]);
    setAdding(null);
  }

  function handleFile(file: File) {
    if (file.size > MAX_SCREENSHOT_BYTES) {
      setUploadError("That image is a bit large — try one under 5MB.");
      return;
    }
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((d) => ({ ...d, screenshotDataUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  return (
    <StepShell
      kicker="Step 5 of 5 — Receipts"
      title="Got receipts?"
      helper="Sunday Stories is much better when it can hold people accountable. Don't worry about organizing it — we'll do that."
      onBack={onBack}
      onNext={onNext}
      onSkip={onNext}
      nextLabel="Finish"
    >
      <div className="space-y-4">
        {receipts.map((r) => (
          <ReceiptRow
            key={r.clientId}
            receipt={r}
            onRemove={() => setReceipts(receipts.filter((x) => x.clientId !== r.clientId))}
          />
        ))}

        {adding === null && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Button variant="outline" onClick={() => startAdding("quote")} className="border-dashed">
              + Add quote
            </Button>
            <Button variant="outline" onClick={() => startAdding("moment")} className="border-dashed">
              + Historical moment
            </Button>
            <Button variant="outline" onClick={() => startAdding("screenshot")} className="border-dashed">
              + Upload screenshot
            </Button>
          </div>
        )}

        {adding === "quote" && (
          <div className="space-y-4 rounded-lg border border-ink-950/10 bg-white p-5">
            <div>
              <Label>The quote</Label>
              <Textarea
                value={draft.quoteText}
                onChange={(e) => setDraft({ ...draft, quoteText: e.target.value })}
                placeholder="&ldquo;I'm going undefeated this year.&rdquo;"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <Label>Who said it</Label>
                <Input
                  value={draft.quoteBy}
                  onChange={(e) => setDraft({ ...draft, quoteBy: e.target.value })}
                  placeholder="Ryan"
                />
              </div>
              <div>
                <Label hint="Optional">Approximate date</Label>
                <Input
                  value={draft.quoteDate}
                  onChange={(e) => setDraft({ ...draft, quoteDate: e.target.value })}
                  placeholder="Aug. 26"
                />
              </div>
            </div>
            <div>
              <Label hint="Optional">Context</Label>
              <Input
                value={draft.quoteContext}
                onChange={(e) => setDraft({ ...draft, quoteContext: e.target.value })}
                placeholder="Said in the group chat, two weeks before the season started."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAdding(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!draft.quoteText.trim()}>
                Save quote
              </Button>
            </div>
          </div>
        )}

        {adding === "moment" && (
          <div className="space-y-4 rounded-lg border border-ink-950/10 bg-white p-5">
            <div>
              <Label>What happened</Label>
              <Input
                value={draft.momentTitle}
                onChange={(e) => setDraft({ ...draft, momentTitle: e.target.value })}
                placeholder="The trade that ended a friendship"
                autoFocus
              />
            </div>
            <div>
              <Label hint="Optional">Details</Label>
              <Textarea
                value={draft.momentDescription}
                onChange={(e) => setDraft({ ...draft, momentDescription: e.target.value })}
                placeholder="Give us the full story..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAdding(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!draft.momentTitle.trim()}>
                Save moment
              </Button>
            </div>
          </div>
        )}

        {adding === "screenshot" && (
          <div className="space-y-4 rounded-lg border border-ink-950/10 bg-white p-5">
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
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-950/15 bg-ink-950/[0.02] py-10 text-sm text-ink-950/50 hover:border-ink-950/30"
            >
              {draft.screenshotDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.screenshotDataUrl}
                  alt="Uploaded screenshot preview"
                  className="max-h-40 rounded-lg object-contain"
                />
              ) : (
                <>
                  <span className="font-display text-sm font-bold uppercase tracking-wide text-ink-950/70">
                    Choose an image
                  </span>
                  <span>PNG or JPG, up to 5MB</span>
                </>
              )}
            </button>
            {uploadError && <p className="text-sm text-crimson-500">{uploadError}</p>}
            <div>
              <Label hint="Optional">Caption</Label>
              <Input
                value={draft.screenshotCaption}
                onChange={(e) => setDraft({ ...draft, screenshotCaption: e.target.value })}
                placeholder="What are we looking at?"
              />
            </div>
            <p className="text-xs leading-relaxed text-ink-950/40">
              Only submit content you&rsquo;re comfortable having incorporated into Sunday
              Stories coverage.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAdding(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!draft.screenshotDataUrl}>
                Save screenshot
              </Button>
            </div>
          </div>
        )}
      </div>
    </StepShell>
  );
}
