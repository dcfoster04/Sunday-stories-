import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Reveal } from "@/components/ui/Reveal";
import { IssueShareBar } from "@/components/preview/IssueShareBar";
import { ButtonLink } from "@/components/ui/Button";
import type { PreviewIssueData } from "@/lib/ai/types";

async function getIssue(slug: string) {
  const row = await db.previewIssue.findUnique({
    where: { shareSlug: slug },
    include: { league: { select: { leagueName: true } } },
  });
  if (!row) return null;
  return { ...row, data: row.data as PreviewIssueData };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) return { title: "Issue Not Found" };

  return {
    title: issue.headline,
    description: issue.dek,
    openGraph: {
      title: issue.headline,
      description: issue.dek,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: issue.headline,
      description: issue.dek,
    },
  };
}

export default async function PreviewIssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const issue = await getIssue(slug);
  if (!issue) notFound();

  const { data, league } = issue;
  const publishedDate = new Date(issue.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <>
      <MarketingNav />
      <main className="bg-paper-100">
        <section className="bg-ink-950 bg-grain py-16 text-center sm:py-24">
          <Container size="narrow">
            <Reveal>
              <Badge tone="flare">{data.issueLabel}</Badge>
              <h1 className="mx-auto mt-5 max-w-2xl text-balance font-display text-3xl font-black uppercase leading-[1.03] tracking-tighter text-paper-100 sm:text-5xl">
                {data.headline}
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-balance text-lg leading-relaxed text-mist-300">
                {data.dek}
              </p>
              <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-mist-500">
                {league.leagueName} &middot; Published {publishedDate}
              </p>
            </Reveal>
          </Container>
        </section>

        {data.powerRankings.length > 0 && (
          <section className="border-b border-ink-950/8 py-16 sm:py-24">
            <Container size="narrow">
              <Reveal>
                <p className="kicker text-flare-600">Preseason Power Rankings</p>
                <h2 className="mt-3 text-balance font-display text-2xl font-black uppercase tracking-tight text-ink-950 sm:text-3xl">
                  Pure vibes. Zero games played.
                </h2>
              </Reveal>
              <div className="mt-8 space-y-3">
                {data.powerRankings.map((r, i) => (
                  <Reveal key={r.rank} delay={Math.min(i * 40, 320)}>
                    <div className="flex items-start gap-4 rounded-lg border border-ink-950/8 bg-white p-5 shadow-[var(--shadow-card)] sm:items-center sm:gap-6">
                      <span className="font-display text-2xl font-black text-ink-950/15 sm:text-3xl">
                        {String(r.rank).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-display text-base font-bold text-ink-950 sm:text-lg">{r.ownerName}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-ink-950/60">{r.blurb}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

        {data.superlatives.length > 0 && (
          <section className="border-b border-ink-950/8 bg-ink-950 bg-grain py-16 sm:py-24">
            <Container size="narrow">
              <Reveal>
                <p className="kicker text-flare-400">Early Superlatives</p>
                <h2 className="mt-3 text-balance font-display text-2xl font-black uppercase tracking-tight text-paper-100 sm:text-3xl">
                  Awards nobody asked for.
                </h2>
              </Reveal>
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.superlatives.map((s, i) => (
                  <Reveal key={i} delay={Math.min(i * 60, 300)}>
                    <div className="h-full rounded-lg bg-white/[0.05] p-5">
                      <p className="font-display text-sm font-bold uppercase tracking-wide text-flare-400">
                        {s.label}
                      </p>
                      <p className="mt-2 font-display text-base font-bold text-paper-100">{s.ownerName}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mist-400">{s.blurb}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        )}

        {data.rivalryToWatch && (
          <section className="py-16 sm:py-24">
            <Container size="narrow">
              <Reveal>
                <div className="rounded-lg border border-crimson-500/25 bg-crimson-500/[0.04] p-8 text-center sm:p-10">
                  <p className="kicker text-crimson-500">Rivalry to Watch</p>
                  <p className="mt-3 font-display text-2xl font-black uppercase tracking-tight text-ink-950 sm:text-3xl">
                    {data.rivalryToWatch.matchup}
                  </p>
                  <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-ink-950/60">
                    {data.rivalryToWatch.blurb}
                  </p>
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {data.boldPredictions.length > 0 && (
          <section className="border-t border-ink-950/8 py-16 sm:py-24">
            <Container size="narrow">
              <Reveal>
                <p className="kicker text-flare-600">Bold Predictions</p>
                <h2 className="mt-3 text-balance font-display text-2xl font-black uppercase tracking-tight text-ink-950 sm:text-3xl">
                  Written down. On the record.
                </h2>
              </Reveal>
              <ol className="mt-8 space-y-4">
                {data.boldPredictions.map((p, i) => (
                  <Reveal key={i} delay={Math.min(i * 60, 240)}>
                    <li className="flex gap-4 rounded-lg bg-ink-950/[0.03] p-5">
                      <span className="font-display text-xl font-black text-flare-600">{i + 1}</span>
                      <p className="font-serif text-lg italic leading-relaxed text-ink-950">{p}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </Container>
          </section>
        )}

        <section className="border-t border-ink-950/8 py-16 text-center sm:py-24">
          <Container size="narrow">
            <Reveal>
              <p className="mx-auto max-w-md font-serif text-xl italic leading-relaxed text-ink-950/70">
                {data.closingLine}
              </p>
              <div className="mt-10">
                <IssueShareBar leagueName={league.leagueName} headline={data.headline} />
              </div>
            </Reveal>
          </Container>
        </section>

        <section className="bg-ink-950 bg-grain py-16 text-center sm:py-20">
          <Container size="narrow">
            <Reveal>
              <p className="kicker text-flare-400">Sunday Stories</p>
              <h2 className="mx-auto mt-4 max-w-md text-balance font-display text-2xl font-black uppercase leading-tight tracking-tighter text-paper-100 sm:text-3xl">
                Your league has a story too.
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-mist-300">
                Onboard your league in about 7 minutes and get your own
                shareable preview issue.
              </p>
              <div className="mt-7">
                <ButtonLink href="/onboarding" size="lg">
                  Start My League
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
