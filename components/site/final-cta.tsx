import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-foreground px-6 py-16 text-center sm:px-16 sm:py-20">
        {/* glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-primary/30 blur-[100px] animate-glow" />
          <div className="absolute bottom-[-30%] right-[10%] h-64 w-64 rounded-full bg-signal/20 blur-[90px]" />
        </div>

        <div className="relative">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance text-background sm:text-4xl">
              Give every maintenance request the response it deserves
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-background/70 text-pretty">
              Turn messy tenant messages into structured, dispatched jobs — and
              give your team its time back. See PropertyFix AI on your own
              properties.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-primary px-7 text-base text-primary-foreground hover:bg-primary/90"
                render={<Link href="/signup" />}
              >
                Book a demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-background/25 bg-transparent px-7 text-base text-background hover:bg-background/10 hover:text-background"
                render={<Link href="/signup" />}
              >
                Start free trial
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-sm text-background/50">
              14-day free trial · No card required · Setup in minutes
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
