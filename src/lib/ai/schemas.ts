// zod schemas for validating structured JSON coming back from the model.
// A live call can hallucinate shape as easily as it can hallucinate facts —
// every AI JSON response is parsed defensively and, on any mismatch, the
// caller falls back to the deterministic mock rather than trusting it.

import { z } from "zod";

const spotlightSchema = z
  .object({
    ownerName: z.string().trim().min(1),
    blurb: z.string().trim().min(1),
  })
  .nullable();

const matchupSchema = z
  .object({
    matchup: z.string().trim().min(1),
    blurb: z.string().trim().min(1),
  })
  .nullable();

const superlativeSchema = z.object({
  label: z.string().trim().min(1).max(80),
  ownerName: z.string().trim().min(1),
  blurb: z.string().trim().min(1),
});

export const leagueProfileDataSchema = z.object({
  leagueArchetype: z.string().trim().min(1).max(60),
  openingLine: z.string().trim().min(1),
  titleContender: spotlightSchema,
  darkHorse: spotlightSchema,
  chaosAgent: spotlightSchema,
  rivalrySpotlight: matchupSchema,
  boldPrediction: z.string().trim().min(1),
  superlatives: z.array(superlativeSchema).max(6),
});

export const previewIssueDataSchema = z.object({
  issueLabel: z.string().trim().min(1).max(40),
  headline: z.string().trim().min(1),
  dek: z.string().trim().min(1),
  powerRankings: z
    .array(
      z.object({
        rank: z.number().int().min(1),
        ownerName: z.string().trim().min(1),
        blurb: z.string().trim().min(1),
      }),
    )
    .max(16),
  superlatives: z.array(superlativeSchema).max(6),
  rivalryToWatch: matchupSchema,
  boldPredictions: z.array(z.string().trim().min(1)).max(5),
  closingLine: z.string().trim().min(1),
});
