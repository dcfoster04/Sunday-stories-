"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { StepDots } from "@/components/ui/ProgressDots";
import { Step1League } from "./steps/Step1League";
import { Step2Characters } from "./steps/Step2Characters";
import { Step3Lore } from "./steps/Step3Lore";
import { Step4Rivalries } from "./steps/Step4Rivalries";
import { Step5Receipts } from "./steps/Step5Receipts";
import { StepFinal } from "./steps/StepFinal";
import { Completion } from "./Completion";
import { EMPTY_STATE, DRAFT_STORAGE_KEY, type OnboardingState } from "./state";
import type { LeagueProfileData } from "@/lib/ai/types";

const TOTAL_STEPS = 6;

type SubmitResult = { leagueName: string; profile: LeagueProfileData; inviteSlug: string };

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const skipNextSave = useRef(false);

  // Hydrate from localStorage once on mount. Intentionally deferred to an
  // effect (rather than a lazy useState initializer) so the server-rendered
  // markup and the first client render both start from EMPTY_STATE — the
  // draft is applied in a deliberate second pass right after mount instead
  // of risking a hydration mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { state: OnboardingState; step: number };
        skipNextSave.current = true;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time draft hydration, not a render loop
        setState(parsed.state ?? EMPTY_STATE);
        setStep(parsed.step ?? 0);
      }
    } catch {
      // ignore corrupt drafts
    } finally {
      setHydrated(true);
    }
  }, []);

  // Autosave.
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    const handle = setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ state, step }));
      } catch {
        // storage may be unavailable (private mode, quota) — draft simply won't persist
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [state, step, hydrated]);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Try again in a moment.");
      }
      const data = (await res.json()) as SubmitResult;
      setResult(data);
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section className="bg-paper-100 py-20 sm:py-28">
        <Container size="narrow">
          <Completion
            leagueName={result.leagueName}
            profile={result.profile}
            inviteSlug={result.inviteSlug}
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-paper-100 py-16 sm:py-20">
      <Container size="narrow">
        <div className="mx-auto mb-10 flex w-full max-w-2xl justify-center">
          <StepDots step={step + 1} total={TOTAL_STEPS} />
        </div>

        {step === 0 && (
          <Step1League
            state={state}
            update={(patch) => setState((s) => ({ ...s, league: { ...s.league, ...patch } }))}
            onNext={next}
          />
        )}
        {step === 1 && (
          <Step2Characters
            owners={state.owners}
            setOwners={(owners) => setState((s) => ({ ...s, owners }))}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 2 && (
          <Step3Lore
            lore={state.lore}
            update={(patch) => setState((s) => ({ ...s, lore: { ...s.lore, ...patch } }))}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 3 && (
          <Step4Rivalries
            owners={state.owners}
            rivalries={state.rivalries}
            setRivalries={(rivalries) => setState((s) => ({ ...s, rivalries }))}
            rapidFire={state.rapidFire}
            setRapidFire={(rapidFire) => setState((s) => ({ ...s, rapidFire }))}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 4 && (
          <Step5Receipts
            receipts={state.receipts}
            setReceipts={(receipts) => setState((s) => ({ ...s, receipts }))}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 5 && (
          <StepFinal
            value={state.fitInAnswer}
            onChange={(v) => setState((s) => ({ ...s, fitInAnswer: v }))}
            onSubmit={submit}
            onBack={back}
            submitting={submitting}
          />
        )}

        {error && (
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-crimson-500">{error}</p>
        )}
      </Container>
    </section>
  );
}
