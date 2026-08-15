import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { db } from "@/lib/db";
import { LorePageClient } from "@/components/dashboard/LorePageClient";

export default async function DashboardLorePage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  const [owners, memories, submissions] = await Promise.all([
    db.owner.findMany({ where: { leagueId: league.id }, orderBy: { createdAt: "asc" } }),
    db.leagueMemory.findMany({ where: { leagueId: league.id }, orderBy: { createdAt: "desc" } }),
    db.memberSubmission.findMany({
      where: { leagueId: league.id },
      orderBy: { createdAt: "desc" },
      include: { submittingOwner: true },
    }),
  ]);

  const ownerNamesById = Object.fromEntries(owners.map((o) => [o.id, o.ownerName]));

  return (
    <LorePageClient
      owners={owners.map((o) => ({ id: o.id, ownerName: o.ownerName }))}
      ownerNamesById={ownerNamesById}
      memories={memories.map((m) => ({
        id: m.id,
        type: m.type,
        title: m.title,
        description: m.description,
        peopleInvolved: (m.peopleInvolved as string[]) ?? [],
        seasonOrYear: m.seasonOrYear,
        importance: m.importance,
        imageUrl: m.imageUrl,
      }))}
      submissions={submissions.map((s) => ({
        id: s.id,
        submittingOwnerName: s.submittingOwner?.ownerName ?? null,
        answers: s.answers as Record<string, unknown>,
        reviewedByCommissioner: s.reviewedByCommissioner,
        createdAt: s.createdAt.toISOString(),
      }))}
    />
  );
}
