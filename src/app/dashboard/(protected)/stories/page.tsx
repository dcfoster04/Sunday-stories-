import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function DashboardStoriesPage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker text-ink-950/40">Stories</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tighter text-ink-950">
        Stories
      </h1>
      <p className="mt-2 text-sm text-ink-950/55">
        Weekly recaps, power rankings, and rivalry previews will land here
        once your season is underway.
      </p>

      {league.leagueSummary && (
        <div className="relative mt-8 overflow-hidden rounded-lg bg-ink-950 bg-grain p-7">
          <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
          <p className="kicker text-flare-400">Season preview</p>
          <p className="mt-3 whitespace-pre-line font-serif text-lg italic leading-relaxed text-paper-100">
            {league.leagueSummary}
          </p>
        </div>
      )}

      <div className="mt-8">
        <EmptyState
          title="No weekly stories yet"
          description="Once your league's season kicks off, Sunday Stories will generate weekly recaps and power rankings here automatically — built on everything in your League Lore."
        />
      </div>
    </div>
  );
}
