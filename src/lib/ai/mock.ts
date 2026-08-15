import "server-only";
import type {
  PowerRankingsInput,
  ReceiptInput,
  RivalryPreviewInput,
  ScoutingReportInput,
  WeeklyStoryInput,
} from "./types";

// Deterministic, dependency-free fallbacks. Used when ANTHROPIC_API_KEY is
// unset, or if the live call fails — the product should never show an
// error state here, just slightly less personalized copy.

function pick<T>(arr: T[], seed: number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[seed % arr.length];
}

function seedFrom(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function mockScoutingReport(input: ScoutingReportInput): string {
  const ageLine: Record<string, string> = {
    first_year: "A brand-new league with no history yet — which means no one can hide behind their reputation.",
    two_to_three: "A young league still figuring out who everyone actually is.",
    four_to_six: "Old enough that the grudges are starting to calcify.",
    seven_to_ten: "A league with real history — and real receipts.",
    ten_plus: "A league old enough that half these rivalries predate some of the rosters.",
  };

  const legendary = input.memories.filter((m) => m.type !== "PREDICTION").slice(0, 1)[0];
  const contenders = input.owners.filter((o) =>
    o.archetypes.some((a) => a === "Perennial Contender"),
  );
  const disasters = input.owners.filter((o) =>
    o.archetypes.some((a) => a === "Perennial Disaster" || a === "Choker"),
  );
  const chaos = input.owners.find((o) => o.archetypes.includes("Chaos Agent"));

  const lines: string[] = [];
  lines.push(ageLine[input.leagueAge] ?? "A league with a story worth telling.");
  lines.push(
    `${input.owners.length || "A handful of"} managers, at least ${
      contenders.length || "a couple"
    } legitimate contenders, and ${disasters.length ? `${disasters.length} certified disaster${disasters.length > 1 ? "s" : ""}` : "no shortage of chaos"}.`,
  );

  if (legendary) {
    lines.push(`And apparently we're going to have to investigate "${legendary.title}."`);
  }
  if (chaos) {
    lines.push(`Keep an eye on ${chaos.ownerName} — nothing in this league happens without them nearby.`);
  }
  if (input.fitInAnswer) {
    lines.push("Noted for the record, straight from the commissioner.");
  }

  lines.push("We're ready.");

  return lines.join(" ");
}

export function mockWeeklyStory(input: WeeklyStoryInput): string {
  const fact = pick(input.headlineFacts, seedFrom(input.leagueName + input.week)) ??
    "another chaotic Sunday";
  return `WEEK ${input.week} — ${input.leagueName.toUpperCase()}\n\n${fact}. The group chat has thoughts. So do we.`;
}

export function mockPowerRankings(input: PowerRankingsInput): string {
  const ranked = [...input.standings];
  const lines = ranked
    .map((s, i) => `${i + 1}. ${s.ownerName} (${s.record})${s.note ? ` — ${s.note}` : ""}`)
    .join("\n");
  return `POWER RANKINGS — ${input.leagueName.toUpperCase()}\n\n${lines}`;
}

export function mockReceipt(input: ReceiptInput): string {
  return `RECEIPTS\n\n"${input.quote}"\n— ${input.quoteBy}${
    input.context ? `, ${input.context}` : ""
  }\n\nWe don't forget. We don't let anyone else forget either.`;
}

export function mockRivalryPreview(input: RivalryPreviewInput): string {
  return `RIVALRY WEEK — ${input.ownerA} vs. ${input.ownerB}\n\n${
    input.reason ?? "Nobody quite remembers how this started. Everyone remembers it's real."
  }`;
}
