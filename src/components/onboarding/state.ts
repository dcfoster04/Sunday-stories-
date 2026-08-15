import type { Platform, LeagueAge, Tone } from "@/lib/types";
import type { RapidFireKey } from "@/lib/validation";

export type DraftOwner = {
  clientId: string;
  ownerName: string;
  teamName: string;
  favoriteNflTeam: string;
  managerDescription: string;
  archetypes: string[];
  extraNotes: string;
};

export type DraftRivalry = {
  clientId: string;
  ownerAClientId: string;
  ownerBClientId: string;
  reason: string;
};

export type DraftReceipt = {
  clientId: string;
  kind: "quote" | "moment" | "screenshot";
  quoteText: string;
  quoteBy: string;
  quoteDate: string;
  quoteContext: string;
  momentTitle: string;
  momentDescription: string;
  screenshotDataUrl?: string;
  screenshotCaption: string;
};

export type OnboardingState = {
  league: {
    leagueName: string;
    platform: Platform | "";
    leagueAge: LeagueAge | "";
    seriousness: number;
    tone: Tone | "";
    toneCustom: string;
    boundaries: string;
  };
  owners: DraftOwner[];
  lore: {
    bestStory: string;
    worstDecision: string;
    painfulLoss: string;
    runningJoke: string;
    insiderThing: string;
  };
  rivalries: DraftRivalry[];
  rapidFire: Partial<Record<RapidFireKey, string>>;
  receipts: DraftReceipt[];
  fitInAnswer: string;
};

export const EMPTY_STATE: OnboardingState = {
  league: {
    leagueName: "",
    platform: "",
    leagueAge: "",
    seriousness: 50,
    tone: "",
    toneCustom: "",
    boundaries: "",
  },
  owners: [],
  lore: {
    bestStory: "",
    worstDecision: "",
    painfulLoss: "",
    runningJoke: "",
    insiderThing: "",
  },
  rivalries: [],
  rapidFire: {},
  receipts: [],
  fitInAnswer: "",
};

export const DRAFT_STORAGE_KEY = "sunday-stories-onboarding-draft-v1";

export function newClientId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function newOwner(): DraftOwner {
  return {
    clientId: newClientId(),
    ownerName: "",
    teamName: "",
    favoriteNflTeam: "",
    managerDescription: "",
    archetypes: [],
    extraNotes: "",
  };
}
