import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";

const LIVE_BLOG: { time: string; pick: string; note: string }[] = [
  {
    time: "7:02 PM",
    pick: "Round 1, Pick 3",
    note: "The reach everyone saw coming. Nobody in the chat is surprised. Everyone in the chat has something to say.",
  },
  {
    time: "8:14 PM",
    pick: "Round 4, Pick 7",
    note: "A rookie WR goes two full rounds early. Sunday Stories has already opened a file on this one.",
  },
  {
    time: "8:41 PM",
    pick: "Round 6, Pick 2",
    note: "Somehow gets the exact player he'd been tweeting about wanting all summer. Suspicious. Noted anyway.",
  },
  {
    time: "9:30 PM",
    pick: "Round 9, Pick 11",
    note: "A kicker, in Round 9. Nobody has said anything yet. Everybody will, by Week 1.",
  },
  {
    time: "10:52 PM",
    pick: "Final Pick",
    note: "Takes the last usable running back on the board and immediately declares himself a genius on record.",
  },
];

export function DraftNightSection() {
  return (
    <section className="border-t border-white/5 bg-ink-950 bg-grain py-24 sm:py-32">
      <Container size="wide">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
          <Reveal>
            <Badge tone="flare">The Marquee Event</Badge>
            <h2 className="mt-5 text-balance font-display text-4xl font-black uppercase leading-[1.02] tracking-tighter text-paper-100 sm:text-5xl">
              Draft Night deserves live coverage.
            </h2>
            <p className="mt-6 max-w-md text-balance text-lg leading-relaxed text-mist-300">
              Every reach, every steal, every &ldquo;he&rsquo;s still on the
              board?&rdquo; — Sunday Stories treats your draft like the main
              event, not an afterthought. Your league gets its own Draft
              Night Preview before the first pick is even made.
            </p>
            <p className="mt-6 font-serif text-xl italic text-flare-300">
              The reaches get remembered either way. Might as well be funny
              about it.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-6 shadow-[var(--shadow-card-dark)] sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="kicker text-flare-400">Live from the draft</p>
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-mist-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flare-400" />
                  On the clock
                </span>
              </div>
              <ol className="mt-5 space-y-5">
                {LIVE_BLOG.map((entry, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="flex w-16 shrink-0 flex-col items-start pt-0.5">
                      <span className="text-xs font-semibold tabular-nums text-mist-500">{entry.time}</span>
                    </div>
                    <div className="min-w-0 border-l border-white/10 pl-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-flare-400">{entry.pick}</p>
                      <p className="mt-1 text-sm leading-relaxed text-mist-300">{entry.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
