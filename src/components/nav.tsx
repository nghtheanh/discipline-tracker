"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  ["/", "Hôm nay"],
  ["/calendar", "Lịch"],
  ["/deep-work", "Deep Work"],
  ["/heatmap", "Bản đồ xanh"],
  ["/report", "Báo cáo tuần"],
];

export function Nav() {
  const p = usePathname();
  if (p === "/") return null;
  return (
    <header className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4">
      <Link href="/" className="text-base font-semibold tracking-tight text-gray-900">
        Sổ kỷ luật
      </Link>
      <nav className="flex gap-1.5 overflow-x-auto">
        {LINKS.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "whitespace-nowrap rounded px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
              p === href && "bg-gray-100 font-medium text-gray-900"
            )}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
