import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";

const COOKIE_NAME = "ss_commissioner_token";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Sets the commissioner session cookie. Must be called from a Server
 * Function (server action) or Route Handler — never during rendering.
 */
export async function setCommissionerCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function clearCommissionerCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Reads the current commissioner's league, or null if unauthenticated. */
export async function getCurrentLeague() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return db.league.findUnique({ where: { commissionerToken: token } });
}

/** Verifies a pasted commissioner token and, if valid, signs in. */
export async function signInWithToken(token: string) {
  const league = await db.league.findUnique({ where: { commissionerToken: token.trim() } });
  if (!league) return null;
  await setCommissionerCookie(league.commissionerToken);
  return league;
}
