// Shared input/output shapes for the AI content-generation service layer.
// These are deliberately plain data (not Prisma types) so the service
// functions can be called with either freshly-collected onboarding data
// or data reloaded from the database later.

export type LeagueProfileOwner = {
  ownerName: string;
  teamName?: string | null;
  favoriteNflTeam?: string | null;
  managerDescription?: string | null;
  archetypes: string[];
  extraNotes?: string | null;
};

export type LeagueProfileMemory = {
  type: string;
  title: string;
  description: string;
  importance?: number;
};

export type LeagueProfileRivalry = {
  ownerA: string;
  ownerB: string;
  reason?: string | null;
};

/** Everything we currently know about a league — the shared context fed to every structured generator. */
export type LeagueProfileInput = {
  leagueName: string;
  leagueAge: string;
  tone: string;
  toneCustom?: string | null;
  seriousness: number;
  boundaries?: string | null;
  fitInAnswer?: string | null;
  owners: LeagueProfileOwner[];
  memories: LeagueProfileMemory[];
  rivalries: LeagueProfileRivalry[];
};

export type LeagueProfileSpotlight = {
  ownerName: string;
  blurb: string;
};

export type LeagueProfileSuperlative = {
  label: string; // e.g. "Most Likely to Rage-Quit the Group Chat"
  ownerName: string;
  blurb: string;
};

/**
 * The structured "what we know about this league" profile — the internal
 * analytical layer. Powers the onboarding-completion scouting report and is
 * the primary input context for a PreviewIssue. Nullable fields mean "not
 * enough signal yet," not an error — a brand-new league with two managers
 * and no lore should still render a good (if sparser) profile.
 */
export type LeagueProfileData = {
  leagueArchetype: string;
  openingLine: string;
  titleContender: LeagueProfileSpotlight | null;
  darkHorse: LeagueProfileSpotlight | null;
  chaosAgent: LeagueProfileSpotlight | null;
  rivalrySpotlight: { matchup: string; blurb: string } | null;
  boldPrediction: string;
  superlatives: LeagueProfileSuperlative[];
};

export type PreviewIssuePowerRanking = {
  rank: number;
  ownerName: string;
  blurb: string;
};

export type PreviewIssueSuperlative = {
  label: string;
  ownerName: string;
  blurb: string;
};

/** The outward-facing, shareable "issue" content — editorial voice, not raw analysis. */
export type PreviewIssueData = {
  issueLabel: string; // e.g. "PRESEASON PREVIEW"
  headline: string;
  dek: string;
  powerRankings: PreviewIssuePowerRanking[];
  superlatives: PreviewIssueSuperlative[];
  rivalryToWatch: { matchup: string; blurb: string } | null;
  boldPredictions: string[];
  closingLine: string;
};

/** A PreviewIssue is generated from the same league context, optionally with a freshly-built profile passed in to keep the two consistent. */
export type PreviewIssueInput = LeagueProfileInput & {
  profile?: LeagueProfileData | null;
};

export type WeeklyStoryInput = {
  leagueName: string;
  week: number;
  season: number;
  tone: string;
  headlineFacts: string[]; // e.g. "Thompson lost after leading by 41"
};

export type PowerRankingsInput = {
  leagueName: string;
  tone: string;
  standings: { ownerName: string; record: string; note?: string }[];
};

export type ReceiptInput = {
  quote: string;
  quoteBy: string;
  context?: string | null;
  tone: string;
};

export type RivalryPreviewInput = {
  leagueName: string;
  ownerA: string;
  ownerB: string;
  reason?: string | null;
  tone: string;
};
