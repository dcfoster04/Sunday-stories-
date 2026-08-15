import "server-only";
import type {
  LeagueProfileData,
  LeagueProfileInput,
  LeagueProfileOwner,
  PowerRankingsInput,
  PreviewIssueData,
  PreviewIssueInput,
  ReceiptInput,
  RivalryPreviewInput,
  WeeklyStoryInput,
} from "./types";

// Deterministic, dependency-free fallbacks. Used when ANTHROPIC_API_KEY is
// unset, or if the live call fails — the product should never show an
// error state here, just slightly less personalized copy. These lean on
// the same voice as the live prompts (dramatic teaser, not a summary), so
// swapping between mock and live output is never visually or tonally
// obvious to the person reading it.

function pick<T>(arr: T[], seed: number): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[((seed % arr.length) + arr.length) % arr.length];
}

function seedFrom(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic shuffle so re-generating the same league doesn't produce an identical-looking issue every time within a session, while staying stable for a given seed. */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const copy = [...arr];
  let s = seed || 1;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const AGE_LINE: Record<string, string> = {
  first_year: "A brand-new league with no history yet — which means no one can hide behind their reputation.",
  two_to_three: "A young league still figuring out who everyone actually is.",
  four_to_six: "Old enough that the grudges are starting to calcify.",
  seven_to_ten: "A league with real history — and real receipts.",
  ten_plus: "A league old enough that half these rivalries predate some of the rosters.",
};

type Superlative = { label: string; blurb: (name: string) => string };

/** Every personality tag maps to a specific, funny superlative — this is most of the brand voice for a sparse league. */
const SUPERLATIVE_BY_ARCHETYPE: Record<string, Superlative> = {
  "Trade Addict": {
    label: "Most Likely to Text “Hear Me Out” at 11 PM",
    blurb: (n) => `${n} has never met a 2-for-1 they didn’t want to make worse.`,
  },
  "Waiver Hawk": {
    label: "Fastest Waiver Wire in the League",
    blurb: (n) => `${n} has the waiver wire on notification and it shows.`,
  },
  "Trash Talker": {
    label: "Loudest Group Chat, Least Consistent Record",
    blurb: (n) => `${n} talks like a 12-0 team and plays like a .500 one.`,
  },
  Homer: {
    label: "Will Always Start Their Guy, Right or Wrong",
    blurb: (n) => `${n} starts their favorite team’s players on pure loyalty, results be damned.`,
  },
  "Perennial Contender": {
    label: "Shows Up Every Single Year",
    blurb: (n) => `${n} is the team everyone else is quietly building around beating.`,
  },
  "Perennial Disaster": {
    label: "Building Character, Not a Roster",
    blurb: (n) => `${n} is proof that hope is a renewable resource.`,
  },
  "Draft Nerd": {
    label: "Has a Spreadsheet for the Spreadsheet",
    blurb: (n) => `${n} prepared for this draft longer than some people prepare for weddings.`,
  },
  Autodrafter: {
    label: "Trusts the Algorithm More Than Themselves",
    blurb: (n) => `${n} let the machine draft and, somehow, has opinions about how it went.`,
  },
  Overthinker: {
    label: "Sets Their Lineup Four Times a Day",
    blurb: (n) => `${n} will change a start/sit decision at 11:58 on Sunday morning, guaranteed.`,
  },
  Lucky: {
    label: "Wins by 0.6 Points, Every Single Week",
    blurb: (n) => `${n} does not need to be good. ${n} needs to be lucky. ${n} is lucky.`,
  },
  Unlucky: {
    label: "Highest Score in the League on a Bye Week",
    blurb: (n) => `${n} has lost to a team that scored fewer points more times than should be mathematically possible.`,
  },
  "Commissioner's Pet": {
    label: "Suspiciously Good Trade Approval Odds",
    blurb: (n) => `${n}’s trades clear the league vote faster than anyone else’s. We’re just saying.`,
  },
  "Never Sets Lineup": {
    label: "Most Likely to Start Someone on a Bye",
    blurb: (n) => `${n} treats the "set lineup" button as more of a suggestion.`,
  },
  "Thinks They're Always Winning the Trade": {
    label: "Genuinely Cannot Tell They Lost the Trade",
    blurb: (n) => `${n} is still telling people about a trade the rest of the league has moved on from.`,
  },
  "Rookie Addict": {
    label: "Drafting For a Season That Isn’t This One",
    blurb: (n) => `${n} is building a roster for three years from now. It is, in fact, this year.`,
  },
  "Veteran Addict": {
    label: "Still Starting a Guy From Their First Draft",
    blurb: (n) => `${n} does not believe in the concept of “too old.”`,
  },
  "Injury Magnet": {
    label: "Cursed. Just Genuinely Cursed.",
    blurb: (n) => `${n}’s bench is a hospital ward by Week 6, every year, without fail.`,
  },
  Choker: {
    label: "Best Regular Season, Worst Week 17",
    blurb: (n) => `${n} peaks in November and it is never, ever November when it matters.`,
  },
  Rebuilder: {
    label: "Rebuilding Since Before It Was Cool",
    blurb: (n) => `${n} has been "one more year away" for several years now.`,
  },
  "Chaos Agent": {
    label: "Nothing Happens in This League Without Them",
    blurb: (n) => `${n} is the reason this league has a group chat with 4,000 unread messages.`,
  },
};

function buildSpotlight(
  owners: LeagueProfileOwner[],
  tags: string[],
  seed: number,
  fallbackBlurb: (name: string) => string,
  exclude: Set<string> = new Set(),
): { ownerName: string; blurb: string } | null {
  const remaining = owners.filter((o) => !exclude.has(o.ownerName));
  const candidates = remaining.filter((o) => o.archetypes.some((a) => tags.includes(a)));
  const chosen = candidates.length ? pick(candidates, seed) : pick(remaining, seed);
  if (!chosen) return null;
  const matchedTag = chosen.archetypes.find((a) => tags.includes(a));
  const blurb = matchedTag ? SUPERLATIVE_BY_ARCHETYPE[matchedTag]?.blurb(chosen.ownerName) : fallbackBlurb(chosen.ownerName);
  return { ownerName: chosen.ownerName, blurb: blurb ?? fallbackBlurb(chosen.ownerName) };
}

function buildSuperlatives(
  owners: LeagueProfileOwner[],
  seed: number,
  count: number,
): { label: string; ownerName: string; blurb: string }[] {
  const tagged = owners
    .flatMap((o) => o.archetypes.map((a) => ({ owner: o, tag: a })))
    .filter(({ tag }) => tag in SUPERLATIVE_BY_ARCHETYPE);
  const shuffled = seededShuffle(tagged, seed);
  const seenOwners = new Set<string>();
  const results: { label: string; ownerName: string; blurb: string }[] = [];
  for (const { owner, tag } of shuffled) {
    if (seenOwners.has(owner.ownerName)) continue;
    const sup = SUPERLATIVE_BY_ARCHETYPE[tag];
    results.push({ label: sup.label, ownerName: owner.ownerName, blurb: sup.blurb(owner.ownerName) });
    seenOwners.add(owner.ownerName);
    if (results.length >= count) break;
  }
  return results;
}

export function mockLeagueProfile(input: LeagueProfileInput): LeagueProfileData {
  const seed = seedFrom(input.leagueName);
  const legendary = input.memories.filter((m) => m.type !== "PREDICTION")[0];
  const rivalry = input.rivalries[0];

  const titleContender = buildSpotlight(
    input.owners,
    ["Perennial Contender", "Lucky"],
    seed,
    (n) => `${n} is the team to beat, and everyone knows it.`,
  );
  const excludeFromDarkHorse = new Set(titleContender ? [titleContender.ownerName] : []);
  const darkHorse = buildSpotlight(
    input.owners,
    ["Rebuilder", "Draft Nerd", "Unlucky"],
    seed + 7,
    (n) => `Nobody’s talking about ${n}. That’s exactly the problem.`,
    excludeFromDarkHorse,
  );
  const excludeFromChaos = new Set(
    [titleContender?.ownerName, darkHorse?.ownerName].filter((n): n is string => Boolean(n)),
  );
  const chaosAgent = buildSpotlight(
    input.owners,
    ["Chaos Agent", "Trade Addict", "Trash Talker"],
    seed + 13,
    (n) => `${n} is unpredictable in the most watchable way possible.`,
    excludeFromChaos,
  );

  const openingLineParts: string[] = [];
  openingLineParts.push(AGE_LINE[input.leagueAge] ?? "A league with a story worth telling.");
  const contenderCount = input.owners.filter((o) => o.archetypes.includes("Perennial Contender")).length;
  const disasterCount = input.owners.filter(
    (o) => o.archetypes.includes("Perennial Disaster") || o.archetypes.includes("Choker"),
  ).length;
  if (input.owners.length) {
    openingLineParts.push(
      `${input.owners.length} manager${input.owners.length === 1 ? "" : "s"}, at least ${
        contenderCount || "a couple"
      } legitimate contender${contenderCount === 1 ? "" : "s"}, and ${
        disasterCount ? `${disasterCount} certified disaster${disasterCount > 1 ? "s" : ""}` : "no shortage of chaos"
      }.`,
    );
  }
  if (legendary) {
    openingLineParts.push(`And apparently we're going to have to investigate "${legendary.title}."`);
  }
  if (chaosAgent) {
    openingLineParts.push(`Keep an eye on ${chaosAgent.ownerName} — nothing here happens without them nearby.`);
  }
  openingLineParts.push("We're ready.");

  const boldPredictionOwner = pick(input.owners, seed + 21);
  const boldPrediction = boldPredictionOwner
    ? `${boldPredictionOwner.ownerName} makes a trade in Week 2 that this league is still talking about by the playoffs.`
    : "Someone in this league is about to make a decision they will regret publicly.";

  return {
    leagueArchetype: pick(
      ["Grudge Match Energy", "Chaotic Good", "Suspiciously Well-Run", "One Bad Trade From Civil War", "Dynasty in the Making"],
      seed,
    ) ?? "A League Worth Covering",
    openingLine: openingLineParts.join(" "),
    titleContender,
    darkHorse,
    chaosAgent,
    rivalrySpotlight: rivalry
      ? {
          matchup: `${rivalry.ownerA} vs. ${rivalry.ownerB}`,
          blurb: rivalry.reason ?? "Nobody quite remembers how this started. Everyone remembers it's real.",
        }
      : null,
    boldPrediction,
    superlatives: buildSuperlatives(input.owners, seed + 3, 4),
  };
}

export function mockPreviewIssue(input: PreviewIssueInput): PreviewIssueData {
  const seed = seedFrom(input.leagueName + "-issue");
  const contenderFirst = [...input.owners].sort((a, b) => {
    const score = (o: LeagueProfileOwner) =>
      (o.archetypes.includes("Perennial Contender") ? -2 : 0) +
      (o.archetypes.includes("Lucky") ? -1 : 0) +
      (o.archetypes.includes("Perennial Disaster") || o.archetypes.includes("Choker") ? 2 : 0);
    return score(a) - score(b);
  });
  const ranked = seededShuffle(contenderFirst, seed).sort((a, b) => {
    // stable-ish re-sort keeps the contender/disaster bias while adding shuffle within tiers
    const score = (o: LeagueProfileOwner) =>
      (o.archetypes.includes("Perennial Contender") ? -2 : 0) +
      (o.archetypes.includes("Lucky") ? -1 : 0) +
      (o.archetypes.includes("Perennial Disaster") || o.archetypes.includes("Choker") ? 2 : 0);
    return score(a) - score(b);
  });

  const rankBlurbs = [
    (n: string) => `${n} enters the season as the team everyone has to plan around.`,
    (n: string) => `${n} is one good draft away from making this look easy.`,
    (n: string) => `${n} is quietly the most dangerous non-contender in the league.`,
    (n: string) => `${n} has a real case, if you squint and ignore last year.`,
    (n: string) => `${n} is exactly the kind of team that makes the playoffs and immediately loses.`,
    (n: string) => `${n} is a middle-of-the-pack team with a top-three ego.`,
    (n: string) => `${n} could go 10-4 or 4-10 and honestly either is believable.`,
    (n: string) => `${n} is rebuilding, whether they'll admit it or not.`,
    (n: string) => `${n} has the offseason moves of a team that means it this year.`,
    (n: string) => `${n} is due for a bounce-back, is what ${n} keeps saying.`,
    (n: string) => `${n} is a wild card in the best and worst sense.`,
    (n: string) => `${n} is here for the group chat as much as the standings, and that's fine.`,
  ];
  const powerRankings = ranked.slice(0, 12).map((o, i) => ({
    rank: i + 1,
    ownerName: o.ownerName,
    blurb: pick(rankBlurbs, seed + i)?.(o.ownerName) ?? `${o.ownerName} is in it to win it. Probably.`,
  }));

  const rivalry = input.rivalries[0];
  const predictionTemplates = [
    (o: LeagueProfileOwner) => `${o.ownerName} starts the season 4-0 and peaks by Halloween.`,
    (o: LeagueProfileOwner) => `${o.ownerName} makes a trade in the first three weeks that the league votes down, then makes it anyway.`,
    (o: LeagueProfileOwner) => `${o.ownerName} finishes exactly one game out of the playoffs and never hears the end of it.`,
    (o: LeagueProfileOwner) => `${o.ownerName} wins Manager of the Week off the back of a waiver-wire pickup nobody else wanted.`,
    (o: LeagueProfileOwner) => `${o.ownerName} sets their lineup incorrectly at least once before Week 4.`,
  ];
  const predictionOwners = seededShuffle(input.owners, seed + 40).slice(0, 3);
  const boldPredictions = predictionOwners.length
    ? predictionOwners.map((o, i) => pick(predictionTemplates, seed + i)?.(o) ?? `${o.ownerName} does something nobody sees coming.`)
    : ["Someone in this league is about to have a very public regular season."];

  return {
    issueLabel: pick(["PRESEASON PREVIEW", "DRAFT NIGHT PREVIEW"], seed) ?? "PRESEASON PREVIEW",
    headline: `${input.leagueName.toUpperCase()}: THE SEASON HASN’T STARTED AND EVERYONE’S ALREADY MAD`,
    dek: "Nobody has played a game yet. That has never stopped anybody in this league from having a strong opinion.",
    powerRankings,
    superlatives: buildSuperlatives(input.owners, seed + 11, 4),
    rivalryToWatch: rivalry
      ? {
          matchup: `${rivalry.ownerA} vs. ${rivalry.ownerB}`,
          blurb: rivalry.reason ?? "Nobody quite remembers how this started. Everyone remembers it's real.",
        }
      : null,
    boldPredictions,
    closingLine: "See you Sunday. Bring receipts.",
  };
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
