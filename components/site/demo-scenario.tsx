"use client";

import { motion } from "motion/react";
import {
  Bot,
  Camera,
  Droplets,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { demoScript } from "@/lib/content";

const viewport = { once: true, margin: "-60px" };

export function DemoScenario() {
  const { messages, ticket, dispatch } = demoScript;

  return (
    <section id="demo" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
        <SectionHeading
          eyebrow="See it in action"
          title="From a one-line message to a dispatched contractor"
          subtitle="A real triage, start to finish. No forms for the tenant — just a conversation that becomes a job."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Chat */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-4">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </span>
              <div className="text-sm">
                <p className="font-semibold leading-none">PropertyFix Assistant</p>
                <p className="mt-1 text-xs text-muted-foreground">Intake · Flat 2, Harbour Court</p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Live
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {messages.map((m, i) => (
                <ChatBubble key={i} index={i} role={m.role} text={m.text} hasPhoto={m.hasPhoto} />
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewport}
                transition={{ delay: 0.9 }}
                className="mt-1 flex items-center gap-2 self-center rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Enough detail captured — building ticket
              </motion.div>
            </div>
          </div>

          {/* Ticket + dispatch */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-signal/10 text-signal">
                    <Droplets className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold">{ticket.title}</h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                  <AlertTriangle className="h-3 w-3" />
                  {ticket.urgency}
                </span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <TicketField label="Trade" value={ticket.trade} />
                <TicketField label="Risk" value={ticket.risk} />
                <TicketField label="Access" value={ticket.access} />
                <TicketField label="Suggested contractor" value={ticket.contractor} />
              </dl>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3">
                <span className="text-sm">
                  <span className="text-muted-foreground">Next action: </span>
                  <span className="font-medium">{ticket.nextAction}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  Approve dispatch
                </span>
              </div>
            </motion.div>

            {/* Contractor dispatch */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.6, delay: 1.25 }}
              className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent p-6"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Send className="h-4 w-4" />
                Dispatched to ABC Plumbing Services
              </div>
              <div className="mt-3 rounded-2xl border border-border bg-card p-4">
                <p className="text-sm leading-relaxed">{dispatch}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Camera className="h-3.5 w-3.5" /> Photos attached
                  <Clock className="ml-2 h-3.5 w-3.5" /> Awaiting confirmation
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({
  role,
  text,
  hasPhoto,
  index,
}: {
  role: "tenant" | "ai";
  text: string;
  hasPhoto?: boolean;
  index: number;
}) {
  const isTenant = role === "tenant";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.45, delay: 0.15 + index * 0.25 }}
      className={`flex items-end gap-2 ${isTenant ? "flex-row-reverse" : ""}`}
    >
      <span
        className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
          isTenant ? "bg-signal/10 text-signal" : "bg-primary/10 text-primary"
        }`}
      >
        {isTenant ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </span>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isTenant
            ? "rounded-br-sm bg-signal text-signal-foreground"
            : "rounded-bl-sm bg-secondary text-foreground"
        }`}
      >
        <p>{text}</p>
        {hasPhoto && (
          <div
            className={`mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs ${
              isTenant ? "bg-white/15" : "bg-background"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            leak-under-sink.jpg
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TicketField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3.5 py-2.5">
      <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
