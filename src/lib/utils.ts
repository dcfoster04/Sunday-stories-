export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const SLUG_ADJECTIVES = [
  "rowdy",
  "clutch",
  "chaotic",
  "legendary",
  "iron",
  "gritty",
  "unbeaten",
  "cursed",
  "prime",
  "wildcard",
];
const SLUG_NOUNS = [
  "league",
  "gridiron",
  "huddle",
  "dynasty",
  "rivalry",
  "trophy",
  "bracket",
  "roster",
  "playoffs",
  "endzone",
];

function randomToken(length: number) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Human-ish, URL-safe slug for the public /join/[slug] link, e.g. "clutch-gridiron-4f2a". */
export function generateInviteSlug(leagueName: string) {
  const base = leagueName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 24)
    .replace(/^-+|-+$/g, "");

  const adjective = SLUG_ADJECTIVES[Math.floor(Math.random() * SLUG_ADJECTIVES.length)];
  const noun = SLUG_NOUNS[Math.floor(Math.random() * SLUG_NOUNS.length)];
  const suffix = randomToken(2);

  return [base || adjective, base ? noun : suffix, base ? suffix : null]
    .filter(Boolean)
    .join("-");
}

/** Opaque bearer secret stored in a cookie for commissioner dashboard access. */
export function generateCommissionerToken() {
  return randomToken(24);
}

export function formatSeriousness(value: number) {
  if (value < 20) return "Strictly for fun";
  if (value < 45) return "Casual, mostly";
  if (value < 70) return "Competitive";
  if (value < 90) return "We have problems";
  return "Send help";
}
