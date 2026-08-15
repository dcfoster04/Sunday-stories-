export type ContributionState = {
  submittingOwnerId: string;
  selfDescription: string;
  overratedOwnerId: string;
  overratedWhy: string;
  wantToBeatOwnerId: string;
  wantToBeatWhy: string;
  leagueHistory: string;
  prediction: string;
  aboutAnotherManager: string;
  rapidFire: Record<string, string>;
  anonymous: {
    overrated: boolean;
    wantToBeat: boolean;
    leagueHistory: boolean;
    prediction: boolean;
    aboutAnotherManager: boolean;
  };
};

export const EMPTY_CONTRIBUTION: ContributionState = {
  submittingOwnerId: "",
  selfDescription: "",
  overratedOwnerId: "",
  overratedWhy: "",
  wantToBeatOwnerId: "",
  wantToBeatWhy: "",
  leagueHistory: "",
  prediction: "",
  aboutAnotherManager: "",
  rapidFire: {},
  anonymous: {
    overrated: false,
    wantToBeat: false,
    leagueHistory: false,
    prediction: false,
    aboutAnotherManager: false,
  },
};

export type SimpleOwner = { id: string; ownerName: string; teamName: string | null };
