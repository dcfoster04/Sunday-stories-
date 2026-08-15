import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReceiptsPageClient } from "@/components/dashboard/ReceiptsPageClient";

export default async function DashboardReceiptsPage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  const [owners, memories] = await Promise.all([
    db.owner.findMany({ where: { leagueId: league.id }, orderBy: { createdAt: "asc" } }),
    db.leagueMemory.findMany({
      where: {
        leagueId: league.id,
        OR: [{ type: "QUOTE" }, { imageUrl: { not: null } }],
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const ownerNamesById = Object.fromEntries(owners.map((o) => [o.id, o.ownerName]));

  return (
    <ReceiptsPageClient
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
    />
  );
}
