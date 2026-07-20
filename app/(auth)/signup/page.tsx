import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Start your free trial
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        14 days free. No card required. Set up your workspace in minutes.
      </p>
      <div className="mt-8">
        <SignupForm />
      </div>
    </div>
  );
}
