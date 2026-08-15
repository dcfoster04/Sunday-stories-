import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-ink-950 bg-grain py-28 text-center sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.18] blur-[130px]"
        style={{ background: "radial-gradient(circle, var(--color-flare-400), transparent 70%)" }}
      />
      <Container size="narrow" className="relative">
        <Reveal>
          <h2 className="text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tighter text-paper-100 sm:text-6xl">
            Give your league a media department.
          </h2>
          <div className="mt-10">
            <ButtonLink href="/onboarding" size="lg">
              Start My League
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
