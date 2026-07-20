import {
  Droplets,
  Zap,
  Flame,
  Camera,
  Send,
  CheckCircle2,
  Circle,
  Smartphone,
  LayoutDashboard,
  FileText,
  HardHat,
} from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

export function Mockups() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="The product"
        title="A polished workspace your team will actually enjoy"
        subtitle="Every screen is designed for speed and clarity — from the tenant's phone to the manager's dashboard."
      />

      <div className="mt-16 grid gap-6 lg:grid-cols-2">
        <Reveal>
          <MockFrame icon={LayoutDashboard} label="Maintenance dashboard">
            <Dashboard />
          </MockFrame>
        </Reveal>
        <Reveal delay={0.08}>
          <MockFrame icon={FileText} label="Ticket detail">
            <TicketDetail />
          </MockFrame>
        </Reveal>
        <Reveal delay={0.12}>
          <MockFrame icon={Smartphone} label="Tenant report (mobile)">
            <TenantMobile />
          </MockFrame>
        </Reveal>
        <Reveal delay={0.16}>
          <MockFrame icon={HardHat} label="Contractor confirmation">
            <ContractorConfirm />
          </MockFrame>
        </Reveal>
      </div>
    </section>
  );
}

function MockFrame({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </div>
        <div className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const rows = [
  { icon: Droplets, title: "Leak under kitchen sink", meta: "Flat 2 · Harbour Court", urg: "Urgent", cls: "bg-red-100 text-red-700", color: "text-signal bg-signal/10" },
  { icon: Zap, title: "Socket not working", meta: "Flat 7 · Meridian House", urg: "Medium", cls: "bg-amber-100 text-amber-800", color: "text-amber-600 bg-amber-100" },
  { icon: Flame, title: "No hot water", meta: "Flat 3 · Camden Row", urg: "Urgent", cls: "bg-red-100 text-red-700", color: "text-orange-600 bg-orange-100" },
];

function Dashboard() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: "Open", v: "12" },
          { k: "Awaiting approval", v: "4" },
          { k: "Resolved (7d)", v: "38" },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border bg-background p-3">
            <div className="text-xl font-semibold">{s.v}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{s.k}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.title} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${r.color}`}>
              <r.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.title}</p>
              <p className="truncate text-[11px] text-muted-foreground">{r.meta}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.cls}`}>{r.urg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketDetail() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Leak under kitchen sink</p>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Urgent</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {[
          ["Trade", "Plumber"],
          ["Risk", "Water damage"],
          ["Access", "After 5 PM"],
          ["Contractor", "ABC Plumbing"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border bg-background px-2.5 py-1.5">
            <div className="text-[9px] uppercase tracking-wide text-muted-foreground">{k}</div>
            <div className="mt-0.5 font-medium">{v}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-14 flex-1 rounded-lg bg-secondary/70" />
        <div className="grid h-14 flex-1 place-items-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Camera className="h-3 w-3" />2 photos</span>
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground">
        Approve dispatch
      </div>
    </div>
  );
}

function TenantMobile() {
  return (
    <div className="mx-auto max-w-[220px]">
      <div className="rounded-[1.6rem] border border-border bg-background p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-primary/10 text-primary">
            <Smartphone className="h-3 w-3" />
          </span>
          Report an issue
        </div>
        <div className="mt-3 space-y-2">
          <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-signal px-3 py-1.5 text-[11px] text-signal-foreground">
            Water leaking under the sink
          </div>
          <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-1.5 text-[11px]">
            Is it active now? A quick photo helps.
          </div>
          <div className="ml-auto flex w-fit items-center gap-1.5 rounded-2xl rounded-br-sm bg-signal px-3 py-1.5 text-[11px] text-signal-foreground">
            <Camera className="h-3 w-3" /> photo.jpg
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground">
          Type a message…
          <Send className="ml-auto h-3 w-3 text-primary" />
        </div>
      </div>
    </div>
  );
}

function ContractorConfirm() {
  const steps = [
    { label: "Job received", done: true },
    { label: "Photos reviewed", done: true },
    { label: "Attendance confirmed", done: false },
  ];
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Send className="h-4 w-4" /> New dispatch
      </div>
      <div className="mt-3 rounded-xl border border-border bg-background p-3 text-xs leading-relaxed">
        Urgent sink leak at Flat 2. Photos attached. Tenant available after 5 PM. Please confirm attendance.
      </div>
      <div className="mt-3 space-y-2">
        {steps.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-xs">
            {s.done ? (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={s.done ? "" : "text-muted-foreground"}>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-primary py-2 text-center text-xs font-semibold text-primary-foreground">
          Confirm
        </div>
        <div className="rounded-lg border border-border py-2 text-center text-xs font-medium">
          Reschedule
        </div>
      </div>
    </div>
  );
}
