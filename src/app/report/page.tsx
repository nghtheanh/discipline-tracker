"use client";
import { useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, Flame, Coffee, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlocks } from "@/hooks/use-blocks";
import { useDays } from "@/hooks/use-days";
import { BLOCK_META, BLOCK_TYPES } from "@/lib/blocks";
import { dateKey } from "@/lib/discipline";
import type { BlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function ReportPage() {
  const days = useDays(400);
  const { blocks } = useBlocks();
  const [weekOffset, setWeekOffset] = useState(0);

  const { weekDays, startKey, endKey } = useMemo(() => {
    const baseMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
    const monday = addDays(baseMonday, weekOffset * 7);
    const list = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i);
      const k = dateKey(d);
      return {
        date: d,
        key: k,
        label: `${DAY_LABELS[i]} ${format(d, "dd/MM")}`,
        doc: days[k],
      };
    });
    return {
      weekDays: list,
      startKey: list[0].key,
      endKey: list[6].key,
    };
  }, [days, weekOffset]);

  const stats = useMemo(() => {
    let totalPct = 0;
    let perfectDays = 0;
    let focusMinutes = 0;
    let focusBreaks = 0;

    for (const wd of weekDays) {
      const pct = wd.doc?.pct ?? 0;
      totalPct += pct;
      if (pct >= 1) perfectDays++;
      focusMinutes += wd.doc?.focusMinutes ?? 0;
      focusBreaks += wd.doc?.focusBreaks ?? 0;
    }

    const byType: Record<BlockType, { planned: number; done: number }> = {
      study: { planned: 0, done: 0 },
      gym: { planned: 0, done: 0 },
      fun: { planned: 0, done: 0 },
      other: { planned: 0, done: 0 },
    };

    for (const b of blocks) {
      if (b.date < startKey || b.date > endKey) continue;
      const mins = Math.max(0, b.end - b.start);
      byType[b.type].planned += mins;
      if (b.done) byType[b.type].done += mins;
    }

    return {
      avgPct: Math.round((totalPct / 7) * 100),
      perfectDays,
      focusMinutes,
      focusBreaks,
      byType,
    };
  }, [weekDays, blocks, startKey, endKey]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-sm text-primary">
          <span className="text-muted-foreground">// </span>báo_cáo_tuần ({format(weekDays[0].date, "dd/MM")} – {format(weekDays[6].date, "dd/MM")})
        </h2>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="font-mono text-xs" onClick={() => setWeekOffset(0)}>
            Tuần này
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset((w) => w + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" /> Trung bình kỷ luật
          </div>
          <div className="mt-1 font-mono text-3xl font-bold text-primary">
            {stats.avgPct}%
          </div>
          <p className="text-xs text-muted-foreground">{stats.perfectDays}/7 ngày đạt 100%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Flame className="h-4 w-4 text-accent" /> Tổng Deep Work
          </div>
          <div className="mt-1 font-mono text-3xl font-bold text-accent">
            {stats.focusMinutes} <span className="text-sm font-normal text-muted-foreground">phút</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {(stats.focusMinutes / 60).toFixed(1)} giờ tập trung sâu
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Coffee className="h-4 w-4 text-destructive" /> Gãy tập trung
          </div>
          <div className="mt-1 font-mono text-3xl font-bold text-destructive">
            {stats.focusBreaks}
          </div>
          <p className="text-xs text-muted-foreground">Số lần thoát Pomodoro sớm</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-sm text-primary">
              <span className="text-muted-foreground">// </span>hoàn_thành_từng_ngày
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weekDays.map((wd) => {
              const pct = Math.round((wd.doc?.pct ?? 0) * 100);
              const frozen = wd.doc?.frozen;
              return (
                <div key={wd.key} className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-foreground">
                      {wd.label} {frozen && <span className="text-accent">(đóng băng)</span>}
                    </span>
                    <span className={cn(pct >= 100 ? "font-bold text-primary" : "text-muted-foreground")}>
                      {pct}% {pct >= 100 && "✕"}
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        pct >= 100
                          ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/.5)]"
                          : "bg-accent"
                      )}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-mono text-sm text-primary">
              <span className="text-muted-foreground">// </span>kế_hoạch_vs_thực_tế (blocks)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {BLOCK_TYPES.map((t) => {
              const meta = BLOCK_META[t];
              const { planned, done } = stats.byType[t];
              const ratio = planned > 0 ? Math.round((done / planned) * 100) : 0;
              return (
                <div key={t} className={cn("rounded border border-l-4 bg-muted/20 p-3", meta.borderClass)}>
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-foreground">{meta.label}</span>
                    <span className="text-muted-foreground">
                      <span className="text-foreground">{done}</span> / {planned} phút ({ratio}%)
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, ratio)}%`,
                        backgroundColor: meta.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
