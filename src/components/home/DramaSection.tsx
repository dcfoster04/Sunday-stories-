import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { EXAMPLE_CARDS } from "@/content/marketing";

export function DramaSection() {
  return (
    <section className="bg-paper-100 py-24 sm:py-32">
      <Container size="wide">
        <Reveal className="text-center">
          <p className="kicker text-ink-950/40">The scores are already everywhere.</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tighter text-ink-950 sm:text-5xl">
            We cover the drama.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLE_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 60} className={i === 0 ? "lg:col-span-2" : undefined}>
              <article
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-lg p-7 transition-transform duration-300 hover:-translate-y-1",
                  card.tone === "dark"
                    ? "bg-ink-950 text-paper-100 shadow-[var(--shadow-card-dark)]"
                    : "hairline-paper bg-white text-ink-950 shadow-[var(--shadow-card)]",
                )}
              >
                {/* broadcast-style top rule */}
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-[3px]",
                    card.tone === "dark" ? "bg-flare-400" : "bg-ink-950/80",
                  )}
                />

                <Badge tone={card.tone === "dark" ? "flare" : "outline"} className="w-fit">
                  {card.tag}
                </Badge>

                <h3
                  className={cn(
                    "mt-4 text-balance font-display font-bold leading-snug",
                    i === 0 ? "text-2xl sm:text-3xl" : "text-xl",
                  )}
                >
                  {card.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 flex-1 text-[15px] leading-relaxed",
                    card.tone === "dark" ? "text-mist-300" : "text-ink-950/60",
                  )}
                >
                  {card.body}
                </p>
                <p
                  className={cn(
                    "mt-5 text-xs font-semibold uppercase tracking-wide",
                    card.tone === "dark" ? "text-mist-500" : "text-ink-950/35",
                  )}
                >
                  {card.kicker}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
