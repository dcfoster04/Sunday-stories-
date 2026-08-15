"use client";

import { useState } from "react";
import { Kicker } from "@/components/ui/Card";
import { MEMBER_RAPID_FIRE_PROMPTS } from "@/lib/validation";

export type DashboardSubmission = {
  id: string;
  submittingOwnerName: string | null;
  answers: Record<string, unknown>;
  reviewedByCommissioner: boolean;
  createdAt: string;
};

function answerText(v: unknown) {
  return typeof v === "string" && v.trim() ? v : null;
}

export function SubmissionsInbox({
  initialSubmissions,
  ownerNamesById,
}: {
  initialSubmissions: DashboardSubmission[];
  ownerNamesById: Record<string, string>;
}) {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  async function toggleReviewed(id: string, reviewed: boolean) {
    setSubmissions((subs) => subs.map((s) => (s.id === id ? { ...s, reviewedByCommissioner: reviewed } : s)));
    await fetch(`/api/dashboard/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewedByCommissioner: reviewed }),
    });
  }

  if (submissions.length === 0) {
    return (
      <p className="rounded-xl bg-ink-950/5 p-4 text-sm text-ink-950/45">
        No submissions yet. Share your contribution link with the league to
        start collecting sources.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((s) => {
        const answers = s.answers;
        const rapidFire = (answers.rapidFire as Record<string, string> | undefined) ?? {};
        return (
          <div
            key={s.id}
            className="rounded-2xl border border-ink-950/8 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Kicker tone={s.reviewedByCommissioner ? "ink" : "crimson"}>
                  {s.reviewedByCommissioner ? "Reviewed" : "New"}
                </Kicker>
                <p className="mt-1 font-display text-sm font-bold text-ink-950">
                  {s.submittingOwnerName ?? "Unknown manager"}
                </p>
              </div>
              <label className="flex items-center gap-2 text-xs text-ink-950/50">
                <input
                  type="checkbox"
                  checked={s.reviewedByCommissioner}
                  onChange={(e) => toggleReviewed(s.id, e.target.checked)}
                />
                Reviewed
              </label>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              {answerText(answers.selfDescription) && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    Self-description
                  </dt>
                  <dd className="mt-0.5 text-ink-950/75">{answerText(answers.selfDescription)}</dd>
                </div>
              )}
              {answerText(answers.overratedOwnerId) && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    Thinks overrated
                  </dt>
                  <dd className="mt-0.5 text-ink-950/75">
                    {ownerNamesById[answers.overratedOwnerId as string] ?? "Unknown"}
                    {answerText(answers.overratedWhy) ? ` — ${answerText(answers.overratedWhy)}` : ""}
                  </dd>
                </div>
              )}
              {answerText(answers.wantToBeatOwnerId) && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    Wants to beat
                  </dt>
                  <dd className="mt-0.5 text-ink-950/75">
                    {ownerNamesById[answers.wantToBeatOwnerId as string] ?? "Unknown"}
                    {answerText(answers.wantToBeatWhy) ? ` — ${answerText(answers.wantToBeatWhy)}` : ""}
                  </dd>
                </div>
              )}
              {answerText(answers.leagueHistory) && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    League history
                  </dt>
                  <dd className="mt-0.5 text-ink-950/75">{answerText(answers.leagueHistory)}</dd>
                </div>
              )}
              {answerText(answers.prediction) && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    Prediction
                  </dt>
                  <dd className="mt-0.5 text-ink-950/75">{answerText(answers.prediction)}</dd>
                </div>
              )}
              {answerText(answers.aboutAnotherManager) && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    About another manager
                  </dt>
                  <dd className="mt-0.5 text-ink-950/75">{answerText(answers.aboutAnotherManager)}</dd>
                </div>
              )}
              {Object.keys(rapidFire).length > 0 && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">
                    Rapid fire
                  </dt>
                  <dd className="mt-0.5 space-y-0.5 text-ink-950/75">
                    {Object.entries(rapidFire).map(([key, ownerId]) => (
                      <p key={key}>
                        {MEMBER_RAPID_FIRE_PROMPTS[key] ?? key}: {ownerNamesById[ownerId] ?? "Unknown"}
                      </p>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
