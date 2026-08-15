"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { StepDots } from "@/components/ui/ProgressDots";
import { StepWhoAreYou } from "./steps/StepWhoAreYou";
import { StepShortAnswer } from "./steps/StepShortAnswer";
import { StepOwnerQuestion } from "./steps/StepOwnerQuestion";
import { StepRapidFire } from "./steps/StepRapidFire";
import { Confirmation } from "./Confirmation";
import { EMPTY_CONTRIBUTION, type ContributionState, type SimpleOwner } from "./state";

const TOTAL_STEPS = 8;

export function ContributionWizard({
  leagueSlug,
  leagueName,
  owners,
}: {
  leagueSlug: string;
  leagueName: string;
  owners: SimpleOwner[];
}) {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<ContributionState>(EMPTY_CONTRIBUTION);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otherOwners = owners.filter((o) => o.id !== state.submittingOwnerId);

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
      const res = await fetch(`/api/join/${leagueSlug}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error("Something went wrong submitting that. Try again?");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <Container size="narrow" className="py-20">
        <Confirmation leagueName={leagueName} />
      </Container>
    );
  }

  return (
    <Container size="narrow" className="py-12 sm:py-16">
      <div className="mx-auto mb-8 flex w-full max-w-lg justify-center">
        <StepDots step={step + 1} total={TOTAL_STEPS} />
      </div>

      {step === 0 && (
        <StepWhoAreYou
          owners={owners}
          value={state.submittingOwnerId}
          onChange={(id) => setState((s) => ({ ...s, submittingOwnerId: id }))}
          onNext={next}
        />
      )}
      {step === 1 && (
        <StepShortAnswer
          kicker="Question 1 of 6"
          question="Describe yourself as a fantasy manager in one sentence."
          placeholder="Ruthlessly efficient. Emotionally unstable. Choose your words."
          value={state.selfDescription}
          onChange={(v) => setState((s) => ({ ...s, selfDescription: v }))}
          onNext={next}
          onBack={back}
        />
      )}
      {step === 2 && (
        <StepOwnerQuestion
          kicker="Question 2 of 6"
          question="Who in this league is dramatically overrated at fantasy football?"
          owners={otherOwners}
          selectedOwnerId={state.overratedOwnerId}
          onSelectOwner={(id) => setState((s) => ({ ...s, overratedOwnerId: id }))}
          why={state.overratedWhy}
          onWhyChange={(v) => setState((s) => ({ ...s, overratedWhy: v }))}
          onNext={next}
          onBack={back}
          anonymous={state.anonymous.overrated}
          onAnonymousChange={(v) =>
            setState((s) => ({ ...s, anonymous: { ...s.anonymous, overrated: v } }))
          }
        />
      )}
      {step === 3 && (
        <StepOwnerQuestion
          kicker="Question 3 of 6"
          question="Who do you most want to beat this year?"
          owners={otherOwners}
          selectedOwnerId={state.wantToBeatOwnerId}
          onSelectOwner={(id) => setState((s) => ({ ...s, wantToBeatOwnerId: id }))}
          why={state.wantToBeatWhy}
          onWhyChange={(v) => setState((s) => ({ ...s, wantToBeatWhy: v }))}
          onNext={next}
          onBack={back}
          anonymous={state.anonymous.wantToBeat}
          onAnonymousChange={(v) =>
            setState((s) => ({ ...s, anonymous: { ...s.anonymous, wantToBeat: v } }))
          }
        />
      )}
      {step === 4 && (
        <StepShortAnswer
          kicker="Question 4 of 6"
          question="Give us one piece of league history the commissioner better have mentioned."
          placeholder="The thing they conveniently left out..."
          value={state.leagueHistory}
          onChange={(v) => setState((s) => ({ ...s, leagueHistory: v }))}
          onNext={next}
          onBack={back}
          anonymous={state.anonymous.leagueHistory}
          onAnonymousChange={(v) =>
            setState((s) => ({ ...s, anonymous: { ...s.anonymous, leagueHistory: v } }))
          }
        />
      )}
      {step === 5 && (
        <StepShortAnswer
          kicker="Question 5 of 6"
          question="Make one prediction we should remind you about later."
          placeholder="Go big. We're keeping receipts."
          value={state.prediction}
          onChange={(v) => setState((s) => ({ ...s, prediction: v }))}
          onNext={next}
          onBack={back}
          anonymous={state.anonymous.prediction}
          onAnonymousChange={(v) =>
            setState((s) => ({ ...s, anonymous: { ...s.anonymous, prediction: v } }))
          }
        />
      )}
      {step === 6 && (
        <StepShortAnswer
          kicker="Question 6 of 6"
          question="Tell us something about another manager Sunday Stories should know."
          placeholder="They won't see this coming."
          value={state.aboutAnotherManager}
          onChange={(v) => setState((s) => ({ ...s, aboutAnotherManager: v }))}
          onNext={next}
          onBack={back}
          anonymous={state.anonymous.aboutAnotherManager}
          onAnonymousChange={(v) =>
            setState((s) => ({ ...s, anonymous: { ...s.anonymous, aboutAnotherManager: v } }))
          }
        />
      )}
      {step === 7 && (
        <StepRapidFire
          owners={owners}
          rapidFire={state.rapidFire}
          setRapidFire={(r) => setState((s) => ({ ...s, rapidFire: r }))}
          onNext={submit}
          onBack={back}
          submitting={submitting}
        />
      )}

      {error && <p className="mt-6 text-center text-sm text-crimson-500">{error}</p>}
    </Container>
  );
}
