"use client";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChecklistCard } from "@/components/checklist-card";
import { CompletionStamp } from "@/components/completion-stamp";
import { DailyReflection } from "@/components/daily-reflection";
import { EnergyBar } from "@/components/energy-bar";
import { useDays } from "@/hooks/use-days";
import { useToday } from "@/hooks/use-today";
import { calcStreak } from "@/lib/discipline";

export default function TodayPage() {
  const t = useToday(), days = useDays();
  const streak = calcStreak({ ...days, [t.key]: { pct: t.day.pct, frozen: t.day.frozen } });
  const habits = (k: "good" | "bad") => t.settings[k].map((h) => ({ ...h, done: !!t.day[k][h.id] }));
  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <div className="grid content-start gap-4">
        <Card className="relative p-5">
          {t.day.pct >= 1 && <CompletionStamp />}
          <p className="mb-3 font-mono text-xl font-semibold">{format(new Date(), "dd/MM/yyyy")}</p>
          <EnergyBar value={t.day.pct} />
        </Card>
        <ChecklistCard title="Việc hôm nay" placeholder="Thêm việc, nhấn Enter" rows={t.day.tasks} onToggle={t.toggleTask} onAdd={t.addTask} onRemove={t.removeTask} />
        <ChecklistCard title="Thói quen cần tránh" hint="Chỉ tick khi bạn đã nói “Không” suốt 24 giờ." placeholder="Thêm điều cần tránh" rows={habits("bad")}
          onToggle={(id) => t.toggleHabit("bad", id)} onAdd={(x) => t.addHabit("bad", x)} onRemove={(id) => t.removeHabit("bad", id)} />
      </div>
      <div className="grid content-start gap-4">
        <Card className="p-5">
          <div className="font-mono text-5xl font-bold text-accent [text-shadow:0_0_22px_hsl(var(--accent)/.35)]">{streak}</div>
          <p className="mb-3 text-muted-foreground">ngày liên tiếp hoàn thành 100%</p>
          <Button variant="outline" size="sm" className="font-mono" onClick={t.toggleFreeze}>{t.day.frozen ? "Bỏ đóng băng hôm nay" : "Đóng băng hôm nay (ốm)"}</Button>
        </Card>
        <ChecklistCard title="Thói quen cần xây dựng" placeholder="Thêm thói quen" rows={habits("good")}
          onToggle={(id) => t.toggleHabit("good", id)} onAdd={(x) => t.addHabit("good", x)} onRemove={(id) => t.removeHabit("good", id)} />
        <DailyReflection
          dayKey={t.key}
          loaded={t.loaded}
          reflection={t.day.reflection}
          onSave={(reflection) => t.saveDay({ reflection })}
        />
      </div>
    </div>
  );
}
