import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contributionSchema } from "@/lib/validation";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  const league = await db.league.findUnique({ where: { inviteSlug: slug } });
  if (!league) {
    return NextResponse.json({ error: "League not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contributionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Some of that didn't look right.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  const owner = await db.owner.findFirst({
    where: { id: payload.submittingOwnerId, leagueId: league.id },
  });
  if (!owner) {
    return NextResponse.json({ error: "Couldn't verify who you are." }, { status: 400 });
  }

  const answers = {
    selfDescription: payload.selfDescription || null,
    overratedOwnerId: payload.overratedOwnerId || null,
    overratedWhy: payload.overratedWhy || null,
    wantToBeatOwnerId: payload.wantToBeatOwnerId || null,
    wantToBeatWhy: payload.wantToBeatWhy || null,
    leagueHistory: payload.leagueHistory || null,
    prediction: payload.prediction || null,
    aboutAnotherManager: payload.aboutAnotherManager || null,
    rapidFire: payload.rapidFire,
  };

  await db.memberSubmission.create({
    data: {
      leagueId: league.id,
      submittingOwnerId: owner.id,
      answers,
      anonymousPreferences: payload.anonymous,
    },
  });

  return NextResponse.json({ ok: true });
}
