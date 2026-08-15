import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";
import { saveDataUrlImage } from "@/lib/uploads";
import { MEMORY_TYPES } from "@/lib/types";

const createSchema = z.object({
  type: z.enum(MEMORY_TYPES),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1500),
  peopleInvolved: z.array(z.string()).max(12).default([]),
  seasonOrYear: z.string().trim().max(40).optional().or(z.literal("")),
  importance: z.number().int().min(1).max(3).default(2),
  attributionAllowed: z.boolean().default(true),
  canBeUsedForJokes: z.boolean().default(true),
  screenshotDataUrl: z.string().optional(),
});

export async function POST(request: Request) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data.", issues: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  let imageUrl: string | null = null;
  if (data.screenshotDataUrl) {
    imageUrl = await saveDataUrlImage(data.screenshotDataUrl, league.id).catch(() => null);
  }

  const memory = await db.leagueMemory.create({
    data: {
      leagueId: league.id,
      type: data.type,
      title: data.title,
      description: data.description,
      peopleInvolved: data.peopleInvolved,
      seasonOrYear: data.seasonOrYear || null,
      importance: data.importance,
      source: "dashboard",
      attributionAllowed: data.attributionAllowed,
      canBeUsedForJokes: data.canBeUsedForJokes,
      imageUrl,
    },
  });

  return NextResponse.json({ memory });
}
