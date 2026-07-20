"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Camera,
  Droplets,
  Clock,
  Wrench,
  CircleCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden grain">
      {/* Ambient gradient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px] animate-glow" />
        <div className="absolute right-[8%] top-[30%] h-[280px] w-[280px] rounded-full bg-signal/10 blur-[90px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI triage for property maintenance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Maintenance requests,{" "}
            <span className="italic text-primary">sorted</span> before you
            open your inbox.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            Tenants report an issue from their phone. PropertyFix AI asks the
            right questions, captures photos, and drafts a clean job ticket —
            so your team approves and dispatches in seconds, not days.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.19 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 px-6 text-base shadow-md shadow-primary/20"
              render={<Link href="/signup" />}
            >
              Book a demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-6 text-base"
              render={<a href="#how-it-works" />}
            >
              See how it works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              No app for tenants
            </span>
            <span className="inline-flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-primary" />
              Human-approved dispatch
            </span>
            <span className="inline-flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-primary" />
              Full audit trail
            </span>
          </motion.div>
        </div>

        {/* Animated mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="animate-float">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-2xl shadow-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Wrench className="h-4 w-4" />
                  </span>
                  Job ticket
                </div>
                <span className="rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                  Urgent
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-secondary/60 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-signal/10 text-signal">
                    <Droplets className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      Active leak under kitchen sink
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Flat 2, 14 Harbour Court
                    </p>
                  </div>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Field label="Trade" value="Plumber" />
                <Field label="Risk" value="Water damage" />
                <Field label="Access" value="Today after 5 PM" />
                <Field label="Contractor" value="ABC Plumbing" />
              </dl>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border bg-background p-2.5 text-xs text-muted-foreground">
                <Camera className="h-4 w-4 text-primary" />
                2 photos attached
                <Clock className="ml-auto h-3.5 w-3.5" />
                <span>2m ago</span>
              </div>

              <Button className="mt-4 w-full" size="sm">
                Approve dispatch
              </Button>
            </div>
          </div>

          {/* Floating incoming-message chip */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="absolute -left-6 -top-5 hidden rounded-2xl border border-border bg-card px-3.5 py-2.5 shadow-xl sm:block"
          >
            <p className="text-xs font-medium">“Water is leaking under the sink”</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Tenant · just now</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
