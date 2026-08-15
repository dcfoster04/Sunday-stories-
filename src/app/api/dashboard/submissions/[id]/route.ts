import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";

const patchSchema = z.object({ reviewedByCommissioner: z.boolean() });

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await context.params;

  const existing = await db.memberSubmission.findUnique({ where: { id } });
  if (!existing || existing.leagueId !== league.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data." }, { status: 400 });

  const submission = await db.memberSubmission.update({
    where: { id },
    data: { reviewedByCommissioner: parsed.data.reviewedByCommissioner },
  });

  return NextResponse.json({ submission });
}
