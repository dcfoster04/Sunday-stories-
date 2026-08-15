import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";
import { LEAGUE_AGES, PLATFORMS, TONES } from "@/lib/types";

const patchSchema = z.object({
  leagueName: z.string().trim().min(1).max(80).optional(),
  platform: z.enum(PLATFORMS).optional(),
  leagueAge: z.enum(LEAGUE_AGES).optional(),
  seriousness: z.number().min(0).max(100).optional(),
  tone: z.enum(TONES).optional(),
  toneCustom: z.string().trim().max(200).nullable().optional(),
  boundaries: z.string().trim().max(500).nullable().optional(),
});

export async function PATCH(request: Request) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await db.league.update({
    where: { id: league.id },
    data: parsed.data,
  });

  return NextResponse.json({ league: updated });
}
