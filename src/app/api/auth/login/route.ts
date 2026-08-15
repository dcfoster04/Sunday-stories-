import { NextResponse } from "next/server";
import { signInWithToken } from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const token = (body as { token?: string } | null)?.token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Enter your commissioner access key." }, { status: 400 });
  }

  const league = await signInWithToken(token);
  if (!league) {
    return NextResponse.json({ error: "That key doesn't match a league." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
