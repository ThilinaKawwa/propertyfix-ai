import Link from "next/link";
import { Logo } from "@/components/brand";
import { ShieldCheck, Bot, Send } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-foreground p-12 text-background lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[10%] h-72 w-72 rounded-full bg-primary/30 blur-[100px]" />
          <div className="absolute bottom-[5%] right-[5%] h-64 w-64 rounded-full bg-signal/20 blur-[90px]" />
        </div>
        <div className="relative">
          <Link href="/" className="inline-flex">
            <span className="text-lg font-bold tracking-tight text-background">
              PropertyFix<span className="text-primary"> AI</span>
            </span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight text-background">
            Turn tenant messages into dispatched jobs — automatically.
          </h2>
          <ul className="mt-8 space-y-4 text-sm text-background/80">
            {[
              { icon: Bot, text: "AI triages every request in seconds" },
              { icon: ShieldCheck, text: "Managers approve before anything dispatches" },
              { icon: Send, text: "Contractors get complete, structured briefs" },
            ].map((f) => (
              <li key={f.text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-background/10 text-primary">
                  <f.icon className="h-4 w-4" />
                </span>
                {f.text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-background/50">
          © {new Date().getFullYear()} PropertyFix AI Ltd
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
