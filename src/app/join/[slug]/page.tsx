import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { ContributionWizard } from "@/components/join/ContributionWizard";

export const metadata: Metadata = {
  title: "Your League Needs Better Sources",
};

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const league = await db.league.findUnique({
    where: { inviteSlug: slug },
    include: { owners: { orderBy: { createdAt: "asc" } } },
  });

  if (!league) notFound();

  return (
    <div className="min-h-screen bg-paper-100">
      <header className="border-b border-ink-950/8">
        <Container size="wide">
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/"
              className="font-display text-sm font-black tracking-tight text-ink-950"
            >
              SUNDAY<span className="text-flare-600">STORIES</span>
            </Link>
          </div>
        </Container>
      </header>

      <section className="bg-ink-950 bg-grain py-14 text-center sm:py-20">
        <Container size="narrow">
          <p className="kicker text-flare-400">{league.leagueName}</p>
          <h1 className="mx-auto mt-4 max-w-md text-balance font-display text-3xl font-black uppercase leading-[1.02] tracking-tighter text-paper-100 sm:text-5xl">
            Your league needs better sources.
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-balance text-[15px] leading-relaxed text-mist-300">
            Give Sunday Stories the information your commissioner conveniently
            forgot to mention.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-mist-500">
            2 minutes. Answers may be used against you.
          </p>
        </Container>
      </section>

      <ContributionWizard
        leagueSlug={league.inviteSlug}
        leagueName={league.leagueName}
        owners={league.owners.map((o) => ({
          id: o.id,
          ownerName: o.ownerName,
          teamName: o.teamName,
        }))}
      />
    </div>
  );
}
