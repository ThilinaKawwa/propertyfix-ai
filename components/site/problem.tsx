import { SectionHeading } from "./section-heading";
import { Stagger, StaggerItem } from "./reveal";
import { problems } from "@/lib/content";

export function Problem() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="The status quo"
        title="Maintenance chaos is quietly costing you"
        subtitle="Requests arrive everywhere at once, half-finished and out of hours. Your team spends its day chasing details instead of resolving issues."
      />

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2">
        {problems.map((p) => (
          <StaggerItem key={p.title}>
            <div className="group flex h-full gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-destructive/30">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <p.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-border bg-secondary/50 p-6 text-center">
        <p className="text-base font-medium text-pretty">
          The result: slow responses, unhappy tenants, frustrated landlords —
          and hours of avoidable admin every week.
        </p>
      </div>
    </section>
  );
}
