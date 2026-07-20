"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bot,
  User,
  Send,
  Camera,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Msg = {
  role: "tenant" | "ai";
  content: string;
  imageUrl?: string;
};

const GREETING =
  "Hi — I'm here to help sort your maintenance issue quickly. In a sentence or two, what's the problem?";

export function ReportChat({ propertyToken }: { propertyToken: string }) {
  const [phase, setPhase] = useState<"loading" | "chat" | "done" | "error">(
    "loading",
  );
  const [statusToken, setStatusToken] = useState<string>("");
  const [property, setProperty] = useState<{ address_line: string; unit_label: string | null } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([{ role: "ai", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const tenantTurns = messages.filter((m) => m.role === "tenant").length;

  useEffect(() => {
    let cancelled = false;
    async function start() {
      const cacheKey = `pf_report_${propertyToken}`;
      const cached =
        typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;
      if (cached) {
        const parsed = JSON.parse(cached);
        if (!cancelled) {
          setStatusToken(parsed.status_token);
          setProperty(parsed.property);
          setPhase("chat");
        }
        return;
      }
      try {
        const res = await fetch("/api/report/start", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ propertyToken }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (cancelled) return;
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
        setStatusToken(data.status_token);
        setProperty(data.property);
        setPhase("chat");
      } catch {
        if (!cancelled) setPhase("error");
      }
    }
    start();
    return () => {
      cancelled = true;
    };
  }, [propertyToken]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "tenant", content: text }]);
    setBusy(true);
    try {
      const res = await fetch("/api/report/message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ statusToken, content: text }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "ai", content: data.reply ?? "Thanks — I've noted that." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !statusToken) return;
    setUploading(true);
    try {
      const path = `${statusToken}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage
        .from("pf-attachments")
        .upload(path, file, { contentType: file.type });
      if (error) throw error;

      await fetch("/api/report/attachment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          statusToken,
          path,
          mime: file.type,
          name: file.name,
        }),
      });

      const localUrl = URL.createObjectURL(file);
      setMessages((m) => [
        ...m,
        { role: "tenant", content: file.name, imageUrl: localUrl },
        {
          role: "ai",
          content: "Thanks, that's really helpful — I can see the issue clearly now.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", content: "That upload didn't work — please try another file." },
      ]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function finish() {
    setBusy(true);
    try {
      const res = await fetch("/api/report/finalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ statusToken }),
      });
      if (!res.ok) throw new Error();
      sessionStorage.removeItem(`pf_report_${propertyToken}`);
      setPhase("done");
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", content: "Couldn't submit just yet — please try again." },
      ]);
      setBusy(false);
    }
  }

  if (phase === "loading") {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-xl font-semibold">This link isn&apos;t valid</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Please check with your property manager for an up-to-date report link.
        </p>
      </div>
    );
  }

  if (phase === "done") {
    const statusUrl = `${site}/status/${statusToken}`;
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Report submitted
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thanks. Your property manager has been notified and will arrange a
          contractor. You can check progress any time using the link below.
        </p>
        <Button className="mt-6" render={<Link href={statusUrl} />}>
          View status
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-lg flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-card/70 px-5 py-4 backdrop-blur">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Bot className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-none">Report a maintenance issue</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {property
              ? `${property.unit_label ? property.unit_label + " · " : ""}${property.address_line}`
              : "PropertyFix AI"}
          </p>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-3.5 w-3.5" />
            </span>
            <span className="flex gap-1">
              <Dot /> <Dot /> <Dot />
            </span>
          </div>
        )}
      </div>

      {/* Finish hint */}
      {tenantTurns >= 2 && (
        <div className="border-t border-border bg-secondary/40 px-4 py-2.5">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={finish}
            disabled={busy}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Submit report to my property manager
          </Button>
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-border bg-card px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            capture="environment"
            className="hidden"
            onChange={onFile}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label="Add photo or video"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Describe the issue…"
            className="flex-1"
          />
          <Button size="icon" onClick={send} disabled={busy || !input.trim()} aria-label="Send">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
          <Paperclip className="h-3 w-3" />
          Photos help us dispatch the right contractor faster
        </p>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isTenant = msg.role === "tenant";
  return (
    <div className={cn("flex items-end gap-2", isTenant && "flex-row-reverse")}>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-full",
          isTenant ? "bg-signal/10 text-signal" : "bg-primary/10 text-primary",
        )}
      >
        {isTenant ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </span>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isTenant
            ? "rounded-br-sm bg-signal text-signal-foreground"
            : "rounded-bl-sm bg-secondary text-foreground",
        )}
      >
        {msg.imageUrl ? (
          <span className="block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={msg.imageUrl}
              alt={msg.content}
              className="mb-1 max-h-48 rounded-lg object-cover"
            />
            <span className="flex items-center gap-1 text-xs opacity-80">
              <Camera className="h-3 w-3" /> {msg.content}
            </span>
          </span>
        ) : (
          msg.content
        )}
      </div>
    </div>
  );
}

function Dot() {
  return <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />;
}
