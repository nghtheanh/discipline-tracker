"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  ["/", "Hôm nay"],
  ["/calendar", "Lịch tuần"],
  ["/deep-work", "Deep Work"],
  ["/heatmap", "Bản đồ xanh"],
  ["/report", "Báo cáo tuần"],
];

export function Nav() {
  const p = usePathname();
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6">
        <Link href="/" className="py-3.5 text-sm font-semibold tracking-tight text-gray-900">
          Sổ kỷ luật
        </Link>
        <nav className="flex gap-5 overflow-x-auto">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "whitespace-nowrap border-b-2 border-transparent py-3.5 text-sm text-gray-500 transition-colors hover:text-gray-900",
                p === href && "border-gray-900 font-medium text-gray-900"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
