import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { Kicker } from "@/components/ui/Card";

export default async function DashboardStoriesPage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker text-ink-950/40">Stories</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tight text-ink-950">
        Stories
      </h1>
      <p className="mt-2 text-sm text-ink-950/55">
        Weekly recaps, power rankings, and rivalry previews will land here
        once your season is underway.
      </p>

      {league.leagueSummary && (
        <div className="mt-8 rounded-2xl bg-ink-950 bg-grain p-7">
          <Kicker tone="gold">Season preview</Kicker>
          <p className="mt-3 whitespace-pre-line font-serif text-lg italic leading-relaxed text-paper-100">
            {league.leagueSummary}
          </p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-dashed border-ink-950/15 bg-white p-10 text-center">
        <p className="font-display text-lg font-bold uppercase tracking-wide text-ink-950/40">
          No weekly stories yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-950/45">
          Once your league&rsquo;s season kicks off, Sunday Stories will
          generate weekly recaps and power rankings here automatically —
          built on everything in your League Lore.
        </p>
      </div>
    </div>
  );
}
