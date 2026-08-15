import "server-only";
import type { LeagueProfileInput, LeagueProfileMemory, LeagueProfileOwner, LeagueProfileRivalry } from "./ai/types";

type LeagueRow = {
  leagueName: string;
  leagueAge: string;
  tone: string;
  toneCustom: string | null;
  seriousness: number;
  boundaries: string | null;
  fitInAnswer: string | null;
};

type OwnerRow = {
  id: string;
  ownerName: string;
  teamName: string | null;
  favoriteNflTeam: string | null;
  managerDescription: string | null;
  archetypes: unknown;
  extraNotes: string | null;
};

type MemoryRow = {
  type: string;
  title: string;
  description: string;
  importance: number;
  peopleInvolved: unknown;
};

/**
 * Reshapes DB rows (league + owners + memories) into the plain
 * LeagueProfileInput the AI layer expects. Rivalries live as
 * `LeagueMemory` rows of type RIVALRY (see src/lib/onboarding.ts) rather
 * than their own table, so they're split back out here.
 */
export function buildLeagueProfileInput(
  league: LeagueRow,
  owners: OwnerRow[],
  memories: MemoryRow[],
): LeagueProfileInput {
  const ownerNameById = new Map(owners.map((o) => [o.id, o.ownerName]));

  const rivalries: LeagueProfileRivalry[] = memories
    .filter((m) => m.type === "RIVALRY")
    .map((m) => {
      const people = Array.isArray(m.peopleInvolved) ? (m.peopleInvolved as string[]) : [];
      const ownerA = people[0] ? ownerNameById.get(people[0]) : undefined;
      const ownerB = people[1] ? ownerNameById.get(people[1]) : undefined;
      if (!ownerA || !ownerB) return null;
      return { ownerA, ownerB, reason: m.description };
    })
    .filter((r): r is Exclude<typeof r, null> => r !== null);

  const profileOwners: LeagueProfileOwner[] = owners.map((o) => ({
    ownerName: o.ownerName,
    teamName: o.teamName,
    favoriteNflTeam: o.favoriteNflTeam,
    managerDescription: o.managerDescription,
    archetypes: Array.isArray(o.archetypes) ? (o.archetypes as string[]) : [],
    extraNotes: o.extraNotes,
  }));

  const profileMemories: LeagueProfileMemory[] = memories
    .filter((m) => m.type !== "RIVALRY")
    .map((m) => ({ type: m.type, title: m.title, description: m.description, importance: m.importance }));

  return {
    leagueName: league.leagueName,
    leagueAge: league.leagueAge,
    tone: league.tone,
    toneCustom: league.toneCustom,
    seriousness: league.seriousness,
    boundaries: league.boundaries,
    fitInAnswer: league.fitInAnswer,
    owners: profileOwners,
    memories: profileMemories,
    rivalries,
  };
}
