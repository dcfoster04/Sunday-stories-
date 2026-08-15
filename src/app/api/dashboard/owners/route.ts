import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";
import { MAX_ARCHETYPES_PER_OWNER } from "@/lib/types";

const createSchema = z.object({
  ownerName: z.string().trim().min(1).max(80),
  teamName: z.string().trim().max(80).nullable().optional(),
  favoriteNflTeam: z.string().trim().max(60).nullable().optional(),
  managerDescription: z.string().trim().max(400).nullable().optional(),
  archetypes: z.array(z.string()).max(MAX_ARCHETYPES_PER_OWNER).default([]),
  extraNotes: z.string().trim().max(400).nullable().optional(),
});

export async function POST(request: Request) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const owner = await db.owner.create({
    data: { ...parsed.data, leagueId: league.id },
  });

  return NextResponse.json({ owner });
}
