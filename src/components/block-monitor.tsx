"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Flame, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBlocks } from "@/hooks/use-blocks";
import { dateToMinutes } from "@/lib/blocks";
import { dateKey } from "@/lib/discipline";
import type { Block } from "@/lib/types";

type ToastItem = {
  id: string;
  kind: "ending" | "study-start";
  block: Block;
  message: string;
};

function nearestPomodoro(durationMin: number): number {
  const options = [25, 45, 50];
  return options.reduce((best, cur) =>
    Math.abs(cur - durationMin) < Math.abs(best - durationMin) ? cur : best
  );
}

export function BlockMonitor() {
  const { blocks, updateBlock } = useBlocks();
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [seenIds, setSeenIds] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const pathname = usePathname();

  // Auto-open /report on Sunday once per session
  useEffect(() => {
    const now = new Date();
    if (now.getDay() !== 0 || pathname === "/report") return;
    const today = dateKey(now);
    if (typeof window !== "undefined" && sessionStorage.getItem("sunday-report-opened") !== today) {
      sessionStorage.setItem("sunday-report-opened", today);
      router.push("/report");
    }
  }, [pathname, router]);

  // Monitor today's blocks for 10-min-before-end warning & study-block-start Deep Work suggestion
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = dateKey(now);
      const nowMin = dateToMinutes(now);
      const newToasts: ToastItem[] = [];
      const nextSeen: Record<string, boolean> = {};

      for (const b of blocks) {
        if (b.date !== today || b.done) continue;

        const endKey = `end:${b.id}:${b.date}:${b.end}`;
        const remaining = b.end - nowMin;
        if (remaining > 0 && remaining <= 10 && !seenIds[endKey]) {
          nextSeen[endKey] = true;
          newToasts.push({
            id: endKey,
            kind: "ending",
            block: b,
            message: `Còn ${remaining} phút nữa kết thúc "${b.title}"`,
          });
        }

        const startKey = `study:${b.id}:${b.date}:${b.start}`;
        if (b.type === "study" && nowMin >= b.start && nowMin < b.start + 5 && !seenIds[startKey]) {
          nextSeen[startKey] = true;
          newToasts.push({
            id: startKey,
            kind: "study-start",
            block: b,
            message: `Block học tập "${b.title}" vừa bắt đầu!`,
          });
        }
      }

      if (newToasts.length > 0) {
        setSeenIds((prev) => ({ ...prev, ...nextSeen }));
        setToasts((prev) => [...prev, ...newToasts]);
      }
    };

    check();
    const id = setInterval(check, 15_000);
    return () => clearInterval(id);
  }, [blocks, seenIds]);

  if (toasts.length === 0) return null;

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded border border-primary/50 bg-card p-3.5 shadow-lg shadow-black/40"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-primary">
              {t.kind === "study-start" ? <Flame className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              <span>{t.kind === "study-start" ? "DEEP WORK" : "SẮP HẾT GIỜ"}</span>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Đóng"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-sm text-foreground">{t.message}</p>
          <div className="mt-2.5 flex gap-2">
            {t.kind === "study-start" ? (
              <Button asChild size="sm" className="font-mono text-xs" onClick={() => dismiss(t.id)}>
                <Link
                  href={`/deep-work?task=${encodeURIComponent(t.block.title)}&minutes=${nearestPomodoro(
                    t.block.end - t.block.start
                  )}`}
                >
                  Vào Deep Work
                </Link>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="font-mono text-xs"
                onClick={() => {
                  updateBlock(t.block.id, { done: true });
                  dismiss(t.id);
                }}
              >
                Đánh dấu xong
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
