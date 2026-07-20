import { Check } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "./reveal";
import { benefits } from "@/lib/content";

export function Benefits() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="The outcome"
        title="Less admin. Faster fixes. Happier everyone."
        subtitle="PropertyFix AI doesn't just organise the chaos — it changes how your maintenance operation performs."
      />

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((b) => (
          <StaggerItem key={b.title}>
            <div className="flex h-full gap-3 rounded-2xl border border-border bg-card p-6">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Check className="h-3.5 w-3.5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {b.body}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
