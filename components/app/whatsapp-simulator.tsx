"use client";

import { useState } from "react";
import { Send, Loader2, Bot, User, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Msg = { role: "tenant" | "ai"; content: string };

export function WhatsappSimulator({ defaultPhone }: { defaultPhone: string }) {
  const [phone, setPhone] = useState(defaultPhone);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  async function sendRaw(body: string) {
    setBusy(true);
    try {
      const form = new URLSearchParams();
      form.set("From", `whatsapp:${phone}`);
      form.set("Body", body);
      form.set("NumMedia", "0");
      const res = await fetch("/api/whatsapp/webhook", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      });
      const xml = await res.text();
      const match = xml.match(/<Message>([\s\S]*?)<\/Message>/);
      const reply = decode(match?.[1] ?? "(no reply)");
      setMessages((m) => [...m, { role: "ai", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "ai", content: "Error contacting webhook." }]);
    } finally {
      setBusy(false);
    }
  }

  function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "tenant", content: text }]);
    sendRaw(text);
  }

  function reset() {
    setMessages([]);
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">WhatsApp simulator</h3>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Simulate an inbound WhatsApp from a tenant. Use a number that matches a property&apos;s
        tenant WhatsApp number to see it triaged into a ticket.
      </p>

      <div className="mt-4 space-y-2">
        <Label htmlFor="sim-phone">Tenant number</Label>
        <Input
          id="sim-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+44 7700 900123"
        />
      </div>

      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">
            Send a message to start. Try: “Water is leaking under the sink”.
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${m.role === "tenant" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                  m.role === "tenant" ? "bg-signal/10 text-signal" : "bg-primary/10 text-primary"
                }`}
              >
                {m.role === "tenant" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === "tenant"
                    ? "rounded-br-sm bg-signal text-signal-foreground"
                    : "rounded-bl-sm bg-secondary"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> assistant is typing…
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a tenant message…"
        />
        <Button size="icon" onClick={send} disabled={busy || !input.trim()} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
