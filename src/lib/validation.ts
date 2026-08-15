import { z } from "zod";
import { LEAGUE_AGES, MAX_ARCHETYPES_PER_OWNER, PLATFORMS, TONES } from "./types";

// ---- shared fragments ----

const clientOwner = z.object({
  clientId: z.string().min(1),
  ownerName: z.string().trim().min(1, "Give this manager a name").max(80),
  teamName: z.string().trim().max(80).optional().or(z.literal("")),
  favoriteNflTeam: z.string().trim().max(60).optional().or(z.literal("")),
  managerDescription: z.string().trim().max(400).optional().or(z.literal("")),
  archetypes: z.array(z.string()).max(MAX_ARCHETYPES_PER_OWNER).default([]),
  extraNotes: z.string().trim().max(400).optional().or(z.literal("")),
});
export type ClientOwner = z.infer<typeof clientOwner>;

const rivalry = z.object({
  ownerAClientId: z.string().min(1),
  ownerBClientId: z.string().min(1),
  reason: z.string().trim().max(400).optional().or(z.literal("")),
});
export type RivalryInput = z.infer<typeof rivalry>;

const rapidFireKeys = [
  "ridiculousTrade",
  "trashTalksThenLoses",
  "reachesInDraft",
  "blamesLuck",
  "winsLeague",
  "finishesLast",
  "causesControversy",
] as const;
export type RapidFireKey = (typeof rapidFireKeys)[number];

export const RAPID_FIRE_PROMPTS: Record<RapidFireKey, string> = {
  ridiculousTrade: "Who's most likely to send a ridiculous trade proposal?",
  trashTalksThenLoses: "Who's most likely to talk the most trash before losing?",
  reachesInDraft: "Who's most likely to draft someone three rounds too early?",
  blamesLuck: "Who blames bad luck for everything?",
  winsLeague: "Who wins the league this year?",
  finishesLast: "Who finishes last?",
  causesControversy: "Who is most likely to cause league controversy?",
};

const rapidFireAnswers = z.record(z.enum(rapidFireKeys), z.string()).default({});

// ---- onboarding payload ----

export const onboardingSchema = z.object({
  league: z.object({
    leagueName: z.string().trim().min(1, "Your league needs a name").max(80),
    platform: z.enum(PLATFORMS),
    leagueAge: z.enum(LEAGUE_AGES),
    seriousness: z.number().min(0).max(100),
    tone: z.enum(TONES),
    toneCustom: z.string().trim().max(200).optional().or(z.literal("")),
    boundaries: z.string().trim().max(500).optional().or(z.literal("")),
  }),
  owners: z.array(clientOwner).max(24).default([]),
  lore: z.object({
    bestStory: z.string().trim().max(1000).optional().or(z.literal("")),
    worstDecision: z.string().trim().max(1000).optional().or(z.literal("")),
    painfulLoss: z.string().trim().max(1000).optional().or(z.literal("")),
    runningJoke: z.string().trim().max(1000).optional().or(z.literal("")),
    insiderThing: z.string().trim().max(1000).optional().or(z.literal("")),
  }),
  rivalries: z.array(rivalry).max(20).default([]),
  rapidFire: rapidFireAnswers,
  receipts: z
    .array(
      z.object({
        kind: z.enum(["quote", "moment", "screenshot"]),
        quoteText: z.string().trim().max(500).optional().or(z.literal("")),
        quoteBy: z.string().trim().max(80).optional().or(z.literal("")),
        quoteDate: z.string().trim().max(40).optional().or(z.literal("")),
        quoteContext: z.string().trim().max(400).optional().or(z.literal("")),
        momentTitle: z.string().trim().max(120).optional().or(z.literal("")),
        momentDescription: z.string().trim().max(1000).optional().or(z.literal("")),
        screenshotDataUrl: z.string().optional(),
        screenshotCaption: z.string().trim().max(200).optional().or(z.literal("")),
      }),
    )
    .max(30)
    .default([]),
  fitInAnswer: z.string().trim().max(1500).optional().or(z.literal("")),
});
export type OnboardingPayload = z.infer<typeof onboardingSchema>;

// ---- member contribution payload ----

export const contributionSchema = z.object({
  submittingOwnerId: z.string().min(1, "Let us know who you are"),
  selfDescription: z.string().trim().max(300).optional().or(z.literal("")),
  overratedOwnerId: z.string().optional().or(z.literal("")),
  overratedWhy: z.string().trim().max(400).optional().or(z.literal("")),
  wantToBeatOwnerId: z.string().optional().or(z.literal("")),
  wantToBeatWhy: z.string().trim().max(400).optional().or(z.literal("")),
  leagueHistory: z.string().trim().max(1000).optional().or(z.literal("")),
  prediction: z.string().trim().max(400).optional().or(z.literal("")),
  aboutAnotherManager: z.string().trim().max(600).optional().or(z.literal("")),
  rapidFire: z
    .record(
      z.enum(["finishesLast", "winsItAll", "worstTrade", "biggestMeltdown", "draftsFavoriteTooEarly"]),
      z.string(),
    )
    .default({}),
  anonymous: z
    .object({
      overrated: z.boolean().default(false),
      wantToBeat: z.boolean().default(false),
      leagueHistory: z.boolean().default(false),
      prediction: z.boolean().default(false),
      aboutAnotherManager: z.boolean().default(false),
    })
    .default({}),
});
export type ContributionPayload = z.infer<typeof contributionSchema>;

export const MEMBER_RAPID_FIRE_PROMPTS: Record<string, string> = {
  finishesLast: "Finish last",
  winsItAll: "Win it all",
  worstTrade: "Make the worst trade",
  biggestMeltdown: "Have the biggest meltdown",
  draftsFavoriteTooEarly: "Draft their favorite NFL player too early",
};
