"use client";

import { useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CopyLink({ url, label = "Copy report link" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Report link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — copy it manually");
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} className="gap-2">
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label}
    </Button>
  );
}

export function OpenLink({ url }: { url: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      render={<a href={url} target="_blank" rel="noopener noreferrer" />}
    >
      <Link2 className="h-3.5 w-3.5" />
      Open
    </Button>
  );
}
