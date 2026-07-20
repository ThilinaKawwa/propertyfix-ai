import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string | null;
}) {
  const mark = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-[0.6rem] bg-primary text-primary-foreground shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="m9.5 14.5 1.8 1.8 3.7-3.8" />
        </svg>
      </span>
      <span className="text-[1.05rem] font-bold tracking-tight text-foreground">
        PropertyFix<span className="text-primary"> AI</span>
      </span>
    </span>
  );

  if (href === null) return mark;
  return (
    <Link href={href} className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {mark}
    </Link>
  );
}
