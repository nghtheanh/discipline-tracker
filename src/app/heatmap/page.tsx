"use client";
import { addDays, format, getDay, isAfter, startOfYear } from "date-fns";
import { Card } from "@/components/ui/card";
import { useDays } from "@/hooks/use-days";
import { dateKey } from "@/lib/discipline";
import { cn } from "@/lib/utils";

const LEVELS = ["bg-muted/60", "bg-emerald-950", "bg-emerald-800", "bg-emerald-500", "bg-primary shadow-[0_0_6px_hsl(var(--primary)/.5)]"];

export default function HeatmapPage() {
  const days = useDays(400), now = new Date(), start = startOfYear(now), cells: React.ReactNode[] = [];
  for (let i = 0; i < (getDay(start) + 6) % 7; i++) cells.push(<i key={`e${i}`} className="h-3.5 w-3.5" />);
  for (let d = start; d.getFullYear() === now.getFullYear(); d = addDays(d, 1)) {
    const k = dateKey(d), p = days[k]?.pct ?? 0, lv = p === 0 ? 0 : p < 0.34 ? 1 : p < 0.67 ? 2 : p < 1 ? 3 : 4;
    cells.push(<i key={k} title={`${format(d, "dd/MM")}: ${Math.round(p * 100)}%`} className={cn("h-3.5 w-3.5 rounded-sm", isAfter(d, now) ? "border border-dashed" : LEVELS[lv])} />);
  }
  return (
    <Card className="overflow-x-auto p-5">
      <h2 className="mb-3 font-mono text-sm text-primary"><span className="text-muted-foreground">// </span>bản_đồ_kỷ_luật {now.getFullYear()}</h2>
      <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">{cells}</div>
    </Card>
  );
}
