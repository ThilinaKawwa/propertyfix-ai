"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/content";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button size="sm" className="shadow-sm" render={<Link href="/signup" />}>
            Book demo
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-[85%] max-w-sm">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex flex-col gap-1 px-4 pt-8">
              {nav.map((item) => (
                <SheetClose
                  key={item.href}
                  render={
                    <a
                      href={item.href}
                      className="rounded-lg px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                    />
                  }
                >
                  {item.label}
                </SheetClose>
              ))}
              <div className="mt-4 flex flex-col gap-2 px-1">
                <Button variant="outline" render={<Link href="/login" />}>
                  Sign in
                </Button>
                <Button render={<Link href="/signup" />}>Book demo</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
