import { NextResponse } from "next/server";
import { clearCommissionerCookie } from "@/lib/auth";

export async function POST() {
  await clearCommissionerCookie();
  return NextResponse.json({ ok: true });
}
