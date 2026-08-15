import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const TIMELINE = [
  { label: "Draft Night", note: "First reads on every roster decision." },
  { label: "Week 1", note: "The first data point in every running joke." },
  { label: "Rivalry Week", note: "History gets cited. Grudges get airtime." },
  { label: "Playoffs", note: "Every prediction from August comes due." },
  { label: "Championship", note: "The story the whole season was building to." },
];

export function MemorySection() {
  return (
    <section className="bg-ink-950 bg-grain py-24 text-paper-100 sm:py-32">
      <Container size="default">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="kicker text-gold-400">Persistent league memory</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-black uppercase leading-[1.05] tracking-tight sm:text-5xl">
            The longer we know your league, the better the stories get.
          </h2>
          <p className="mt-6 text-balance text-lg leading-relaxed text-mist-300">
            Every trade, collapse, and prediction becomes part of an ongoing
            narrative — not a one-off recap. Sunday Stories remembers what
            happened in Week 3 when it&rsquo;s writing about Week 15.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-16">
          <div className="relative">
            <div className="absolute left-0 right-0 top-4 hidden h-px bg-white/10 sm:block" />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-5 sm:gap-4">
              {TIMELINE.map((step, i) => (
                <div key={step.label} className="relative flex flex-col items-start sm:items-center sm:text-center">
                  <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold-400 bg-ink-950 font-display text-xs font-bold text-gold-400">
                    {i + 1}
                  </div>
                  <p className="mt-3 font-display text-sm font-bold uppercase tracking-wide text-paper-100">
                    {step.label}
                  </p>
                  <p className="mt-1 max-w-[14rem] text-sm leading-relaxed text-mist-500">
                    {step.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-16 text-center">
          <p className="font-serif text-2xl italic text-gold-300 sm:text-3xl">
            From Draft Night to Championship Sunday.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
