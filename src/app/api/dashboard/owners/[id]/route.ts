import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";
import { MAX_ARCHETYPES_PER_OWNER } from "@/lib/types";

const patchSchema = z.object({
  ownerName: z.string().trim().min(1).max(80).optional(),
  teamName: z.string().trim().max(80).nullable().optional(),
  favoriteNflTeam: z.string().trim().max(60).nullable().optional(),
  managerDescription: z.string().trim().max(400).nullable().optional(),
  archetypes: z.array(z.string()).max(MAX_ARCHETYPES_PER_OWNER).optional(),
  extraNotes: z.string().trim().max(400).nullable().optional(),
});

async function ownerBelongsToLeague(id: string, leagueId: string) {
  const owner = await db.owner.findUnique({ where: { id } });
  return owner && owner.leagueId === leagueId ? owner : null;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await context.params;

  const existing = await ownerBelongsToLeague(id, league.id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const owner = await db.owner.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ owner });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await context.params;

  const existing = await ownerBelongsToLeague(id, league.id);
  if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await db.owner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
