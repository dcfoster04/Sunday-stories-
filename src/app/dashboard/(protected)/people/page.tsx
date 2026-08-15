import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { db } from "@/lib/db";
import { OwnerManager } from "@/components/dashboard/OwnerManager";

export default async function DashboardPeoplePage() {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  const owners = await db.owner.findMany({
    where: { leagueId: league.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <p className="kicker text-ink-950/40">The Roster</p>
      <h1 className="mt-2 font-display text-3xl font-black uppercase tracking-tighter text-ink-950">
        Manager Profiles
      </h1>
      <p className="mt-2 text-sm text-ink-950/55">
        Every profile here shapes how Sunday Stories writes about that
        person. League members can also fill these in themselves via your
        contribution link.
      </p>

      <div className="mt-8">
        <OwnerManager
          initialOwners={owners.map((o) => ({
            id: o.id,
            ownerName: o.ownerName,
            teamName: o.teamName,
            favoriteNflTeam: o.favoriteNflTeam,
            managerDescription: o.managerDescription,
            archetypes: (o.archetypes as string[]) ?? [],
            extraNotes: o.extraNotes,
          }))}
        />
      </div>
    </div>
  );
}
