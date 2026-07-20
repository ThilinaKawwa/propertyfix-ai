"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { signUpAction, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    signUpAction,
    {},
  );

  if (state.message) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
        <p className="mt-3 text-sm text-foreground">{state.message}</p>
        <Button variant="outline" className="mt-4" render={<Link href="/login" />}>
          Go to sign in
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="full_name">Your name</Label>
          <Input id="full_name" name="full_name" required placeholder="Jordan Smith" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="agency_name">Agency name</Label>
          <Input id="agency_name" name="agency_name" required placeholder="Harbour Lettings" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@agency.co.uk" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="At least 8 characters" />
      </div>

      {state.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to our Terms and Privacy Policy.
      </p>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
