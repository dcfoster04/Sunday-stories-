import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Kicker } from "@/components/ui/Card";
import { HeadlineTicker } from "./HeadlineTicker";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 bg-grain pt-10 pb-16 sm:pt-14">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[900px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, var(--color-gold-400), transparent 70%)" }}
      />

      <div className="relative border-y border-white/10 py-3">
        <HeadlineTicker />
      </div>

      <Container size="wide" className="relative pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <Kicker tone="paper" className="justify-center">
            Sunday Stories
          </Kicker>
          <h1 className="mt-6 text-balance font-display text-[13vw] font-black uppercase leading-[0.95] tracking-tight text-paper-100 sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Your fantasy league
            <br />
            has a story.
          </h1>
          <p className="mt-6 font-serif text-3xl italic text-gold-300 sm:text-4xl">
            We cover it.
          </p>
          <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-mist-300">
            Sunday Stories turns your league&rsquo;s scores, history, rivalries,
            predictions and questionable decisions into personalized sports
            coverage your group chat will actually want to read.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/onboarding" size="lg">
              Start My League
            </ButtonLink>
            <ButtonLink href="/demo" size="lg" variant="outline" className="text-paper-100">
              See a Demo
            </ButtonLink>
          </div>
        </div>
      </Container>

      <div className="relative mt-16 border-t border-white/10 py-3">
        <HeadlineTicker reverse />
      </div>
    </section>
  );
}
