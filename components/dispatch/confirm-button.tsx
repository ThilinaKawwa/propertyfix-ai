"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmButton({
  dispatchToken,
  initialConfirmed,
}: {
  dispatchToken: string;
  initialConfirmed: boolean;
}) {
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/dispatch/confirm", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ dispatchToken }),
      });
      if (!res.ok) throw new Error();
      setConfirmed(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (confirmed) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        <CheckCircle2 className="h-4 w-4" />
        Attendance confirmed — thank you
      </div>
    );
  }

  return (
    <div>
      <Button size="lg" className="w-full" onClick={confirm} disabled={busy}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Confirm attendance
      </Button>
      {error && <p className="mt-2 text-center text-sm text-destructive">{error}</p>}
    </div>
  );
}
