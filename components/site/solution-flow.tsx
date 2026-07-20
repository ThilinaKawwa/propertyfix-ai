import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "./reveal";
import { steps } from "@/lib/content";

export function SolutionFlow() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border/70 bg-card/40"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="One clean workflow, end to end"
          subtitle="From the tenant's first message to the landlord's final summary — PropertyFix AI carries every job through a single, structured path."
        />

        <Stagger className="mt-16 grid gap-6 md:grid-cols-5">
          {steps.map((s, i) => (
            <StaggerItem key={s.step} className="relative">
              {/* connector */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-primary/40 to-transparent md:block" />
              )}
              <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <s.icon className="h-6 w-6" />
                  </span>
                </div>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Step {s.step}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
