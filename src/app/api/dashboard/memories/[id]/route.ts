import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentLeague } from "@/lib/auth";

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const league = await getCurrentLeague();
  if (!league) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  const { id } = await context.params;

  const existing = await db.leagueMemory.findUnique({ where: { id } });
  if (!existing || existing.leagueId !== league.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await db.leagueMemory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
