import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { LeagueSettingsForm } from "@/components/dashboard/LeagueSettingsForm";

export default async function DashboardLeaguePage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  return (
    <div className="mx-auto max-w-2xl">
      <p className="kicker text-ink-950/40">League</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-ink-950">
        League Settings
      </h1>
      <p className="mt-2 text-sm text-ink-950/55">
        The basics Sunday Stories uses to calibrate every story it writes.
      </p>

      <div className="mt-8">
        <LeagueSettingsForm
          league={{
            leagueName: league.leagueName,
            platform: league.platform as "sleeper" | "espn" | "yahoo" | "nfl" | "cbs" | "other",
            leagueAge: league.leagueAge as
              | "first_year"
              | "two_to_three"
              | "four_to_six"
              | "seven_to_ten"
              | "ten_plus",
            seriousness: league.seriousness,
            tone: league.tone as "espn" | "locker_room" | "savage" | "custom",
            toneCustom: league.toneCustom ?? "",
            boundaries: league.boundaries ?? "",
          }}
        />
      </div>

      {league.leagueSummary && (
        <div className="mt-10 rounded-2xl bg-ink-950 bg-grain p-6">
          <p className="kicker text-gold-400">Current scouting report</p>
          <p className="mt-3 whitespace-pre-line font-serif text-base italic leading-relaxed text-paper-100">
            {league.leagueSummary}
          </p>
        </div>
      )}
    </div>
  );
}
