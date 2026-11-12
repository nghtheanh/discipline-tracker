"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [["/", "Hôm nay"], ["/calendar", "Lịch"], ["/deep-work", "Deep Work"], ["/heatmap", "Bản đồ xanh"], ["/report", "Báo cáo tuần"]];
export function Nav() {
  const p = usePathname();
  return (
    <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-mono text-xl font-bold text-primary [text-shadow:0_0_18px_hsl(var(--primary)/.35)]"><span className="text-muted-foreground">&gt; </span>Sổ kỷ luật_</h1>
      <nav className="flex gap-1.5 overflow-x-auto">
        {LINKS.map(([href, label]) => (
          <Link key={href} href={href} className={cn("whitespace-nowrap rounded border bg-card px-3 py-1.5 font-mono text-[13px] hover:border-primary", p === href && "border-primary bg-primary/10 font-semibold text-primary")}>{label}</Link>
        ))}
      </nav>
    </header>
  );
}
