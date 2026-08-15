import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validation";
import { buildMemoryDrafts } from "@/lib/onboarding";
import { saveDataUrlImage } from "@/lib/uploads";
import { setCommissionerCookie } from "@/lib/auth";
import { generateInviteSlug, generateCommissionerToken } from "@/lib/utils";
import { generateLeagueProfile } from "@/lib/ai/service";
import { buildLeagueProfileInput } from "@/lib/leagueProfile";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some of that didn't look right.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  const inviteSlug = generateInviteSlug(payload.league.leagueName);
  const commissionerToken = generateCommissionerToken();

  const league = await db.league.create({
    data: {
      leagueName: payload.league.leagueName,
      platform: payload.league.platform,
      leagueAge: payload.league.leagueAge,
      seriousness: payload.league.seriousness,
      tone: payload.league.tone,
      toneCustom: payload.league.toneCustom || null,
      boundaries: payload.league.boundaries || null,
      fitInAnswer: payload.fitInAnswer || null,
      inviteSlug,
      commissionerToken,
    },
  });

  const ownerIdByClientId = new Map<string, string>();
  for (const owner of payload.owners) {
    if (!owner.ownerName.trim()) continue;
    const created = await db.owner.create({
      data: {
        leagueId: league.id,
        ownerName: owner.ownerName.trim(),
        teamName: owner.teamName || null,
        favoriteNflTeam: owner.favoriteNflTeam || null,
        managerDescription: owner.managerDescription || null,
        archetypes: owner.archetypes,
        extraNotes: owner.extraNotes || null,
      },
    });
    ownerIdByClientId.set(owner.clientId, created.id);
  }

  const memoryDrafts = buildMemoryDrafts(payload, ownerIdByClientId);
  for (const draft of memoryDrafts) {
    let imageUrl: string | null = null;
    if (draft.screenshotDataUrl) {
      imageUrl = await saveDataUrlImage(draft.screenshotDataUrl, league.id).catch(() => null);
    }
    await db.leagueMemory.create({
      data: {
        leagueId: league.id,
        type: draft.type,
        title: draft.title,
        description: draft.description,
        peopleInvolved: draft.peopleInvolved,
        seasonOrYear: draft.seasonOrYear ?? null,
        importance: draft.importance,
        source: draft.source,
        imageUrl,
      },
    });
  }

  const owners = await db.owner.findMany({ where: { leagueId: league.id } });
  const memories = await db.leagueMemory.findMany({ where: { leagueId: league.id } });

  const profile = await generateLeagueProfile(buildLeagueProfileInput(league, owners, memories));

  await db.leagueProfile.create({
    data: { leagueId: league.id, data: profile },
  });
  await db.league.update({
    where: { id: league.id },
    data: { leagueSummary: profile.openingLine },
  });

  await setCommissionerCookie(commissionerToken);

  return NextResponse.json({
    leagueName: league.leagueName,
    inviteSlug: league.inviteSlug,
    profile,
  });
}
