"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  HardHat,
  Landmark,
  MessageCircle,
  Menu,
  LogOut,
} from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Tickets", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/contractors", label: "Contractors", icon: HardHat },
  { href: "/dashboard/landlords", label: "Landlords", icon: Landmark },
  { href: "/dashboard/channels", label: "Channels", icon: MessageCircle },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = l.exact
          ? pathname === l.href
          : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DesktopSidebar({
  agencyName,
  userEmail,
}: {
  agencyName: string;
  userEmail: string;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 p-4 lg:flex">
      <div className="px-2 py-2">
        <Logo />
      </div>
      <div className="mt-2 rounded-lg bg-secondary/60 px-3 py-2.5">
        <p className="truncate text-sm font-semibold">{agencyName}</p>
        <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
      </div>
      <div className="mt-6 flex-1">
        <NavLinks />
      </div>
      <form action={signOutAction}>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </form>
    </aside>
  );
}

export function MobileTopbar({ agencyName }: { agencyName: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between border-b border-border bg-card/60 px-4 py-3 backdrop-blur lg:hidden">
      <Logo />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" aria-label="Menu" />}
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-4">
          <SheetTitle className="px-2 text-sm font-semibold">{agencyName}</SheetTitle>
          <div className="mt-6">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
          <form action={signOutAction} className="mt-6">
            <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
