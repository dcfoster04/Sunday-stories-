// Shared literal-union "enums" — the source of truth for values that would
// be a Prisma enum on Postgres, but are validated strings here because the
// SQLite dev datasource has no native enum support (see schema.prisma).

export const PLATFORMS = ["sleeper", "espn", "yahoo", "nfl", "cbs", "other"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const PLATFORM_LABELS: Record<Platform, string> = {
  sleeper: "Sleeper",
  espn: "ESPN",
  yahoo: "Yahoo",
  nfl: "NFL",
  cbs: "CBS",
  other: "Other",
};

export const LEAGUE_AGES = [
  "first_year",
  "two_to_three",
  "four_to_six",
  "seven_to_ten",
  "ten_plus",
] as const;
export type LeagueAge = (typeof LEAGUE_AGES)[number];

export const LEAGUE_AGE_LABELS: Record<LeagueAge, string> = {
  first_year: "First year",
  two_to_three: "2–3 years",
  four_to_six: "4–6 years",
  seven_to_ten: "7–10 years",
  ten_plus: "10+ years",
};

export const TONES = ["espn", "locker_room", "savage", "custom"] as const;
export type Tone = (typeof TONES)[number];

export const TONE_LABELS: Record<Tone, string> = {
  espn: "ESPN — clever but clean",
  locker_room: "Locker Room — sarcastic",
  savage: "Savage — nobody is safe",
  custom: "Custom",
};

export const MEMORY_TYPES = [
  "TRADE",
  "CHAMPIONSHIP",
  "COLLAPSE",
  "QUOTE",
  "RIVALRY",
  "PUNISHMENT",
  "CONTROVERSY",
  "RUNNING_JOKE",
  "PREDICTION",
  "DRAFT",
  "OTHER",
] as const;
export type MemoryType = (typeof MEMORY_TYPES)[number];

export const MEMORY_TYPE_LABELS: Record<MemoryType, string> = {
  TRADE: "Legendary Trade",
  CHAMPIONSHIP: "Championship",
  COLLAPSE: "Collapse",
  QUOTE: "Quote / Receipt",
  RIVALRY: "Rivalry",
  PUNISHMENT: "Punishment",
  CONTROVERSY: "Controversy",
  RUNNING_JOKE: "Running Joke",
  PREDICTION: "Prediction",
  DRAFT: "Draft Night",
  OTHER: "Other",
};

export const ARCHETYPES = [
  "Trade Addict",
  "Waiver Hawk",
  "Trash Talker",
  "Homer",
  "Perennial Contender",
  "Perennial Disaster",
  "Draft Nerd",
  "Autodrafter",
  "Overthinker",
  "Lucky",
  "Unlucky",
  "Commissioner's Pet",
  "Never Sets Lineup",
  "Thinks They're Always Winning the Trade",
  "Rookie Addict",
  "Veteran Addict",
  "Injury Magnet",
  "Choker",
  "Rebuilder",
  "Chaos Agent",
] as const;
export type Archetype = (typeof ARCHETYPES)[number];

export const MAX_ARCHETYPES_PER_OWNER = 3;

export const IMPORTANCE_LEVELS = [1, 2, 3] as const;
export type Importance = (typeof IMPORTANCE_LEVELS)[number];
export const IMPORTANCE_LABELS: Record<Importance, string> = {
  1: "Minor",
  2: "Notable",
  3: "Legendary",
};
