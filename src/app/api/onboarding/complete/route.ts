import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validation";
import { buildMemoryDrafts } from "@/lib/onboarding";
import { saveDataUrlImage } from "@/lib/uploads";
import { setCommissionerCookie } from "@/lib/auth";
import { generateInviteSlug, generateCommissionerToken } from "@/lib/utils";
import { generateLeagueScoutingReport } from "@/lib/ai/service";

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

  const scoutingReport = await generateLeagueScoutingReport({
    leagueName: league.leagueName,
    leagueAge: league.leagueAge,
    tone: league.tone,
    toneCustom: league.toneCustom,
    seriousness: league.seriousness,
    boundaries: league.boundaries,
    fitInAnswer: league.fitInAnswer,
    owners: owners.map((o) => ({
      ownerName: o.ownerName,
      teamName: o.teamName,
      managerDescription: o.managerDescription,
      archetypes: (o.archetypes as string[]) ?? [],
    })),
    memories: memories.map((m) => ({ type: m.type, title: m.title, description: m.description })),
  });

  await db.league.update({
    where: { id: league.id },
    data: { leagueSummary: scoutingReport },
  });

  await setCommissionerCookie(commissionerToken);

  return NextResponse.json({
    leagueName: league.leagueName,
    inviteSlug: league.inviteSlug,
    scoutingReport,
  });
}
