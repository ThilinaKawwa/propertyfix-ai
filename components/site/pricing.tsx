import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "./reveal";
import { Button } from "@/components/ui/button";
import { pricing } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-y border-border/70 bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple monthly pricing that scales with you"
          subtitle="No setup fees. No per-ticket charges. Cancel anytime."
        />

        <Stagger className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <StaggerItem key={tier.name}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-7",
                  tier.featured
                    ? "border-primary/40 bg-card shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                    : "border-border bg-card",
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 min-h-[2.5rem] text-sm text-muted-foreground">
                  {tier.tagline}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{tier.cadence}</span>
                </div>

                <Button
                  className="mt-6 w-full"
                  variant={tier.featured ? "default" : "outline"}
                  size="lg"
                  render={<Link href="/signup" />}
                >
                  {tier.cta}
                </Button>

                <ul className="mt-7 space-y-3 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Every plan includes a 14-day free trial. Prices exclude VAT.
        </p>
      </div>
    </section>
  );
}
