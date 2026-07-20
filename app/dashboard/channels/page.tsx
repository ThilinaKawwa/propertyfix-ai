import type { Metadata } from "next";
import { MessageCircle, Webhook, Phone, Copy } from "lucide-react";
import { listProperties } from "@/lib/db/queries";
import { WhatsappSimulator } from "@/components/app/whatsapp-simulator";
import { CopyLink } from "@/components/app/copy-link";

export const metadata: Metadata = { title: "Channels" };

export default async function ChannelsPage() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const webhookUrl = `${site}/api/whatsapp/webhook`;
  const properties = await listProperties();
  const withPhone = properties.find((p) => p.tenant_phone);

  return (
    <div className="mx-auto max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Channels</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Let tenants report maintenance the way they already message you.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* WhatsApp setup */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
              <MessageCircle className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">WhatsApp intake</h2>
              <p className="text-xs text-muted-foreground">Powered by Twilio WhatsApp</p>
            </div>
          </div>

          <ol className="mt-5 space-y-4 text-sm">
            <Step n={1} title="Add tenant numbers">
              On each property, set the tenant&apos;s WhatsApp number. Inbound messages are matched
              to the property automatically.
            </Step>
            <Step n={2} title="Connect Twilio">
              In your Twilio WhatsApp Sender settings, set the inbound webhook (“When a message
              comes in”) to the URL below.
            </Step>
            <Step n={3} title="Go live">
              Tenants message your WhatsApp number; the assistant triages and creates tickets here.
            </Step>
          </ol>

          <div className="mt-5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Webhook className="h-3.5 w-3.5" /> Inbound webhook URL
            </div>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 break-all rounded-lg bg-secondary/60 px-3 py-2 font-mono text-xs">
                {webhookUrl}
              </code>
              <CopyLink url={webhookUrl} label="Copy" />
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Copy className="h-3 w-3" />
              Method: POST · Format: Twilio (application/x-www-form-urlencoded) · Returns TwiML.
            </p>
          </div>

          {!withPhone && (
            <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Tip: add a tenant WhatsApp number to a property first so the simulator can match it.
            </p>
          )}
        </div>

        {/* Simulator */}
        <WhatsappSimulator defaultPhone={withPhone?.tenant_phone ?? "+44 7700 900123"} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Phone className="h-4 w-4 text-primary" /> Other channels
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Every property also has a web report link (see Properties) that works on any phone with no
          app. SMS and email intake are on the roadmap.
        </p>
      </div>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
        {n}
      </span>
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-0.5 text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
