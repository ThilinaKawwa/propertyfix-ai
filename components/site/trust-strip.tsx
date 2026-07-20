import { Reveal, Stagger, StaggerItem } from "./reveal";
import { trustLogos, trustMetrics } from "@/lib/content";

export function TrustStrip() {
  return (
    <section className="border-y border-border/70 bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <Reveal className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Built for modern property operations
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {trustLogos.map((name) => (
            <span
              key={name}
              className="text-base font-semibold tracking-tight text-foreground/45 transition-colors hover:text-foreground/70"
            >
              {name}
            </span>
          ))}
        </div>

        <Stagger className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {trustMetrics.map((m) => (
            <StaggerItem key={m.label} className="text-center">
              <div className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
                {m.value}
              </div>
              <div className="mx-auto mt-2 max-w-[14ch] text-sm text-muted-foreground">
                {m.label}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          Illustrative figures shown for demonstration.
        </p>
      </div>
    </section>
  );
}
