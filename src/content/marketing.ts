// Fictional example content for the marketing site. Nothing here is real —
// it exists to demonstrate what Sunday Stories generates for a real league.

export const TICKER_HEADLINES = [
  "BREAKING — Thompson Blows 41-Point Lead",
  "RIVALRY WEEK — Miller vs. Foster",
  "RECEIPTS — “I’m going undefeated.” — Ryan, Aug. 26",
  "POWER RANKINGS — Kevin Falls to #10",
  "DRAFT NIGHT — The Reach Heard Round the League",
  "DEVELOPING — Someone Forgot to Set Their Lineup. Again.",
  "CONTROVERSY — The Trade Nobody Can Explain",
  "OVERTIME — Sanchez Survives by 0.4 Points",
];

export type ExampleCard = {
  kicker: string;
  title: string;
  body: string;
  tone: "dark" | "paper";
  tag: string;
};

export const EXAMPLE_CARDS: ExampleCard[] = [
  {
    kicker: "The Collapse",
    tag: "COLLAPSE",
    title: "Thompson Blows a 41-Point Lead, Somehow Finds a Way to Lose by 2",
    body: "Up 41 on Thursday night. Down 2 by Monday. Historians are already calling it the single greatest choke in league history, and the league is only three years old.",
    tone: "dark",
  },
  {
    kicker: "The Receipt",
    tag: "QUOTE",
    title: "“I’m Going Undefeated This Year.” — Ryan, August 26th",
    body: "Ryan is 2-6. Sunday Stories would like to formally reintroduce this quote into the record, as promised.",
    tone: "paper",
  },
  {
    kicker: "Rivalry Week",
    tag: "RIVALRY",
    title: "Miller vs. Foster: The Trade That Still Hasn’t Been Forgiven",
    body: "Three years later, nobody agrees on who won the trade — only that somebody definitely lost it, and it definitely wasn’t Miller who thinks so.",
    tone: "dark",
  },
  {
    kicker: "Power Rankings",
    tag: "RANKINGS",
    title: "Kevin Falls to #10 After a Week Even His Mom Won’t Defend",
    body: "A bench full of byes, a lineup nobody set, and a loss to the worst team in the league. Kevin has entered his villain era, just not the good kind.",
    tone: "paper",
  },
  {
    kicker: "Breaking News",
    tag: "BREAKING",
    title: "Commissioner Confirms Trade Deadline Will Not Be Extended Again",
    body: "For the third consecutive season, at least one manager has requested “just 48 more hours.” For the third consecutive season, the answer is no.",
    tone: "dark",
  },
  {
    kicker: "Manager of the Week",
    tag: "SPOTLIGHT",
    title: "Foster Wins Manager of the Week After a Waiver Move Nobody Saw Coming",
    body: "Picked up a backup running back on a Tuesday. Started him on a hunch. Outscored the league by 30. This is why nobody trusts Foster's calm exterior.",
    tone: "paper",
  },
];

// Templates for the homepage "Try It" widget. `{league}` is replaced with
// whatever the visitor typed (or the placeholder league name). Purely
// client-side and deterministic — no AI call, no backend, so anyone can
// play with it before signing up.
export type TryItTemplate = {
  kicker: string;
  tag: string;
  headline: string;
  body: string;
};

export const TRY_IT_TEMPLATES: Record<"espn" | "locker_room" | "savage", TryItTemplate[]> = {
  espn: [
    {
      kicker: "Breaking News",
      tag: "BREAKING",
      headline: "{league} Survives Week 1 Behind a Miracle Waiver Pickup",
      body: "Nobody drafted him. Somebody started him on a hunch. {league} is already writing its own script, and it's only Week 1.",
    },
    {
      kicker: "Breaking News",
      tag: "BREAKING",
      headline: "Commissioner of {league} Confirms Trade Deadline Will Not Be Extended Again",
      body: "For the third consecutive season, at least one manager has requested “just 48 more hours.” For the third consecutive season, the answer is no.",
    },
    {
      kicker: "Power Rankings",
      tag: "RANKINGS",
      headline: "{league_poss} Preseason Favorite Already Has a Target on Their Back",
      body: "Nobody has played a game. Everybody already has a plan to beat them anyway.",
    },
  ],
  locker_room: [
    {
      kicker: "Group Chat",
      tag: "DEVELOPING",
      headline: "{league} Group Chat Hits 4,000 Unread Messages Before Kickoff",
      body: "Somebody made a bold prediction. Somebody else screenshotted it. Nobody in {league} has forgotten.",
    },
    {
      kicker: "Group Chat",
      tag: "DEVELOPING",
      headline: "{league_poss} Preseason Favorite Already Making Excuses",
      body: "The season hasn't started. The excuses have. This is going to be a long year for somebody.",
    },
    {
      kicker: "Rivalry Watch",
      tag: "RIVALRY",
      headline: "The {league} Rivalry Nobody Can Explain to Outsiders",
      body: "It doesn't matter who started it. It matters that it's still going, and everyone's picked a side.",
    },
  ],
  savage: [
    {
      kicker: "The Collapse",
      tag: "COLLAPSE",
      headline: "{league} Manager Loses by 0.4, Immediately Blames Everyone But Himself",
      body: "The bench outscored the starters. He's not talking about it. We are, in detail, forever.",
    },
    {
      kicker: "Receipts",
      tag: "QUOTE",
      headline: "{league_poss} Worst Trade Ever Just Got Worse",
      body: "Three years later, somebody's still trying to explain it. Nobody in {league} is buying it.",
    },
    {
      kicker: "The Read",
      tag: "SPOTLIGHT",
      headline: "{league} Has a Perennial Disaster, and Everyone Knows Exactly Who It Is",
      body: "New season, same guy. Vegas would not take this bet. We're taking it anyway.",
    },
  ],
};

export const DEMO_STORIES = [
  {
    kicker: "Breaking",
    title: "Thompson Blows 41-Point Lead in Historic Week 6 Collapse",
    dek: "Up 41. Down 2. A full timeline of the least believable four days in league history.",
    body: [
      "It started, as these things do, with a Thursday night blowout. By kickoff Sunday, Thompson's lead over Diaz sat at a comfortable 41 points — the kind of margin that gets you a group chat full of premature victory laps.",
      "Then Sunday happened. Then Monday happened. By the time the last whistle blew, Thompson's bench had somehow outscored Diaz's starters, three separate players were on bye without a backup plan, and a final 2-point margin turned a laugher into league lore.",
      "Sunday Stories has reviewed the box score six times. We still don't fully believe it either.",
    ],
  },
  {
    kicker: "Receipts",
    title: "“I'm Going Undefeated This Year.” — Ryan, August 26th",
    dek: "Filed for the record, as promised, in front of everyone.",
    body: [
      "On August 26th, in the league group chat, at 9:47pm, Ryan predicted an undefeated season. Sunday Stories does not forget predictions. That is, in fact, most of what we do.",
      "Current record: 2-6. We'll keep filing this one until it stops being funny, which — based on precedent — will be never.",
    ],
  },
  {
    kicker: "Power Rankings",
    title: "Week 9 Power Rankings: Kevin Falls to #10, Everyone Has Thoughts",
    dek: "A full bench of byes, an unset lineup, and a loss nobody predicted.",
    body: [
      "#1 Foster (7-2) — Quietly assembling the most boring dynasty in league history, in the best way.",
      "#2 Miller (6-3) — Still mad about the trade. Still winning anyway.",
      "...",
      "#10 Kevin (2-7) — A bench full of byes, a lineup nobody set, and a loss to the worst team in the league. The villain era continues.",
    ],
  },
];
