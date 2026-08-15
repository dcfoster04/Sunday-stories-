import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";
import { generateLeagueProfile } from "@/lib/ai/service";
import { buildLeagueProfileInput } from "@/lib/leagueProfile";

/**
 * Regenerates a league's LeagueProfile from whatever owners/memories exist
 * right now — used by the dashboard "Regenerate" action once member
 * submissions or dashboard edits have added more signal than onboarding
 * alone provided.
 */
export async function POST() {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const [owners, memories] = await Promise.all([
    db.owner.findMany({ where: { leagueId: league.id } }),
    db.leagueMemory.findMany({ where: { leagueId: league.id } }),
  ]);

  const profile = await generateLeagueProfile(buildLeagueProfileInput(league, owners, memories));

  await db.leagueProfile.upsert({
    where: { leagueId: league.id },
    create: { leagueId: league.id, data: profile },
    update: { data: profile },
  });
  await db.league.update({
    where: { id: league.id },
    data: { leagueSummary: profile.openingLine },
  });

  return NextResponse.json({ profile });
}
