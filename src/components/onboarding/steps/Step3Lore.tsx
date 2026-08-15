"use client";

import { useState } from "react";
import { StepShell } from "@/components/ui/StepShell";
import { Textarea } from "@/components/ui/Field";
import { StepDots } from "@/components/ui/ProgressDots";
import type { OnboardingState } from "../state";

type LoreKey = keyof OnboardingState["lore"];

const QUESTIONS: { key: LoreKey; question: string; helper: string; placeholder: string }[] = [
  {
    key: "bestStory",
    question: "What's the one story everyone in this league still talks about?",
    helper: "A terrible trade, legendary comeback, draft disaster, punishment, controversy…",
    placeholder: "Tell us what happened...",
  },
  {
    key: "worstDecision",
    question: "What's the worst fantasy decision anyone has ever made?",
    helper: "The trade, the bench call, the auto-draft — whatever it was.",
    placeholder: "Who, and what did they do?",
  },
  {
    key: "painfulLoss",
    question: "Who suffered the most painful loss in league history? What happened?",
    helper: "The kind of loss that gets brought up unprompted, years later.",
    placeholder: "Name the manager and describe the damage...",
  },
  {
    key: "runningJoke",
    question: "What's the league's longest-running joke?",
    helper: "Every league has one. What's yours?",
    placeholder: "Explain the joke — and where it came from, if you know...",
  },
  {
    key: "insiderThing",
    question:
      "What's something about this league that would make absolutely no sense to an outsider but everyone here understands?",
    helper: "The nickname, the rule, the tradition that needs zero explanation internally.",
    placeholder: "Try to explain it anyway...",
  },
];

export function Step3Lore({
  lore,
  update,
  onNext,
  onBack,
}: {
  lore: OnboardingState["lore"];
  update: (patch: Partial<OnboardingState["lore"]>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [index, setIndex] = useState(0);
  const current = QUESTIONS[index];
  const isLast = index === QUESTIONS.length - 1;
  const isFirst = index === 0;

  function goNext() {
    if (isLast) onNext();
    else setIndex(index + 1);
  }

  function goBack() {
    if (isFirst) onBack();
    else setIndex(index - 1);
  }

  return (
    <StepShell
      kicker="Step 3 of 5 — League Lore"
      title={current.question}
      helper={current.helper}
      onBack={goBack}
      onNext={goNext}
      onSkip={goNext}
      nextLabel={isLast ? "Continue" : "Next question"}
    >
      <div className="mb-5">
        <StepDots step={index + 1} total={QUESTIONS.length} />
      </div>
      <Textarea
        value={lore[current.key]}
        onChange={(e) => update({ [current.key]: e.target.value })}
        placeholder={current.placeholder}
        className="min-h-40"
        autoFocus
      />
    </StepShell>
  );
}
