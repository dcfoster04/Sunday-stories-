import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { db } from "@/lib/db";
import { NewsroomHub } from "@/components/dashboard/NewsroomHub";

export default async function DashboardStoriesPage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  const [ownerCount, issueRow] = await Promise.all([
    db.owner.count({ where: { leagueId: league.id } }),
    db.previewIssue.findFirst({ where: { leagueId: league.id }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="kicker text-ink-950/40">The Newsroom</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tighter text-ink-950">
        Press Room
      </h1>
      <p className="mt-2 text-sm text-ink-950/55">
        The flagship issue your league actually reads: a shareable Preseason
        Preview built from everything Sunday Stories knows about your
        managers, rivalries, and lore. Regenerate it any time more comes in.
      </p>

      <NewsroomHub
        ownerCount={ownerCount}
        issue={
          issueRow
            ? {
                shareSlug: issueRow.shareSlug,
                issueLabel: issueRow.issueLabel,
                headline: issueRow.headline,
                dek: issueRow.dek,
                updatedAt: issueRow.updatedAt.toISOString(),
              }
            : null
        }
      />

      <div className="mt-10 border-t border-ink-950/8 pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-950/35">Coming to this desk</p>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-950/50">
          Weekly recaps and in-season power rankings will land here
          automatically once your league&rsquo;s schedule kicks off.
        </p>
      </div>
    </div>
  );
}
