// Shared input/output shapes for the AI content-generation service layer.
// These are deliberately plain data (not Prisma types) so the service
// functions can be called with either freshly-collected onboarding data
// or data reloaded from the database later.

export type ScoutingReportOwner = {
  ownerName: string;
  teamName?: string | null;
  managerDescription?: string | null;
  archetypes: string[];
};

export type ScoutingReportMemory = {
  type: string;
  title: string;
  description: string;
};

export type ScoutingReportInput = {
  leagueName: string;
  leagueAge: string;
  tone: string;
  toneCustom?: string | null;
  seriousness: number;
  boundaries?: string | null;
  fitInAnswer?: string | null;
  owners: ScoutingReportOwner[];
  memories: ScoutingReportMemory[];
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
