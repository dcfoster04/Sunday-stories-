import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { PRICING_TIERS } from "@/content/pricing";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-paper-100 py-24 sm:py-32">
      <Container size="wide">
        <Reveal className="text-center">
          <p className="kicker text-ink-950/40">Pricing</p>
          <h2 className="mx-auto mt-4 max-w-xl text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tighter text-ink-950 sm:text-5xl">
            Give your league a press box.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PRICING_TIERS.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <div
                className={cn(
                  "flex h-full flex-col rounded-lg p-8",
                  tier.featured
                    ? "bg-ink-950 text-paper-100 shadow-[var(--shadow-card-dark)] ring-1 ring-flare-400/40"
                    : "hairline-paper bg-white text-ink-950",
                )}
              >
                {tier.featured && (
                  <Badge tone="flare" className="mb-4 w-fit">
                    Most Popular
                  </Badge>
                )}
                <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-black">{tier.price}</span>
                  {tier.period && (
                    <span
                      className={cn(
                        "text-sm",
                        tier.featured ? "text-mist-400" : "text-ink-950/45",
                      )}
                    >
                      {tier.period}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-3 text-sm leading-relaxed",
                    tier.featured ? "text-mist-300" : "text-ink-950/55",
                  )}
                >
                  {tier.description}
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={cn(
                        "flex items-start gap-2 text-sm",
                        tier.featured ? "text-mist-300" : "text-ink-950/65",
                      )}
                    >
                      <span className={tier.featured ? "text-flare-400" : "text-flare-600"}>
                        &#10003;
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <ButtonLink
                  href="/onboarding"
                  className="mt-8 w-full"
                  variant={tier.featured ? "primary" : "dark"}
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
