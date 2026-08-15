import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/MarketingNav";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { DEMO_STORIES } from "@/content/marketing";

export const metadata: Metadata = {
  title: "See a Demo",
  description: "A preview of the kind of coverage Sunday Stories generates for a real league.",
};

export default function DemoPage() {
  return (
    <>
      <MarketingNav />
      <main className="bg-paper-100">
        <section className="bg-ink-950 bg-grain py-20 text-center sm:py-28">
          <Container size="narrow">
            <Kicker tone="paper" className="justify-center">
              A preview, not a real league
            </Kicker>
            <h1 className="mt-6 text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tighter text-paper-100 sm:text-6xl">
              This is what your league&rsquo;s coverage looks like.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-mist-300">
              Every name, quote and stat below is fictional — built to show
              what Sunday Stories generates once it actually knows your
              league.
            </p>
          </Container>
        </section>

        <section className="py-20 sm:py-28">
          <Container size="narrow" className="space-y-10">
            {DEMO_STORIES.map((story, i) => (
              <Reveal key={story.title} delay={i * 80}>
                <article className="relative overflow-hidden hairline-paper rounded-lg bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
                  <span className="absolute inset-x-0 top-0 h-[3px] bg-flare-400" />
                  <Kicker tone="flare">{story.kicker}</Kicker>
                  <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-ink-950 sm:text-3xl">
                    {story.title}
                  </h2>
                  <p className="mt-3 font-serif text-lg italic text-ink-950/60">{story.dek}</p>
                  <div className="mt-6 space-y-4 border-t border-ink-950/8 pt-6">
                    {story.body.map((p, j) => (
                      <p key={j} className="text-[15px] leading-relaxed text-ink-950/75">
                        {p}
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </Container>
        </section>

        <section className="border-t border-ink-950/8 py-20 text-center sm:py-28">
          <Container size="narrow">
            <Reveal>
              <h2 className="text-balance font-display text-3xl font-black uppercase leading-tight tracking-tighter text-ink-950 sm:text-4xl">
                Your league&rsquo;s version is seven minutes away.
              </h2>
              <div className="mt-8">
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
