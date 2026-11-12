"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Pause, X, Flame, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToday } from "@/hooks/use-today";
import { cn } from "@/lib/utils";

const DURATIONS = [25, 45, 50] as const;

const QUOTES = [
  "Kỷ luật là cầu nối giữa mục tiêu và thành tựu.",
  "Đừng chờ cảm hứng. Hãy bắt đầu, cảm hứng sẽ tự đến.",
  "Một giờ tập trung tuyệt đối giá trị hơn cả ngày làm việc phân tâm.",
  "Sự nhất quán nhỏ mỗi ngày tạo nên kết quả phi thường.",
  "Tắt mọi tiếng ồn. Chỉ còn bạn và một việc duy nhất.",
];

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function DeepWorkContent() {
  const searchParams = useSearchParams();
  const { day, saveDay } = useToday();

  const [minutes, setMinutes] = useState<number>(25);
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [customTask, setCustomTask] = useState<string>("");
  const [active, setActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [quoteIdx, setQuoteIdx] = useState(0);

  const dayRef = useRef(day);
  const saveDayRef = useRef(saveDay);
  dayRef.current = day;
  saveDayRef.current = saveDay;

  useEffect(() => {
    const qTask = searchParams.get("task");
    const qMin = Number(searchParams.get("minutes"));
    if (qTask) setCustomTask(qTask);
    if (DURATIONS.includes(qMin as (typeof DURATIONS)[number])) {
      setMinutes(qMin);
    }
  }, [searchParams]);

  const activeTaskTitle = customTask.trim() || selectedTask || "Tập trung sâu (Deep Work)";

  useEffect(() => {
    if (!active || paused || completed) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setCompleted(true);
          saveDayRef.current({ focusMinutes: (dayRef.current.focusMinutes ?? 0) + minutes });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active, paused, completed, minutes]);

  const startSession = () => {
    setQuoteIdx(Math.floor(Math.random() * QUOTES.length));
    setSecondsLeft(minutes * 60);
    setPaused(false);
    setCompleted(false);
    setActive(true);
  };

  const exitEarly = () => {
    if (!completed && secondsLeft > 0) {
      saveDay({ focusBreaks: (day.focusBreaks ?? 0) + 1 });
    }
    setActive(false);
    setPaused(false);
  };

  const undoneTasks = day.tasks.filter((t) => !t.done);

  return (
    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-primary">
            <span className="text-muted-foreground">// </span>deep_work_pomodoro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-2 font-mono text-xs text-muted-foreground">Thời lượng phiên (phút)</p>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <Button
                  key={d}
                  type="button"
                  variant={minutes === d ? "default" : "outline"}
                  className="font-mono"
                  onClick={() => setMinutes(d)}
                >
                  {d} phút
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-mono text-xs text-muted-foreground">Chọn đúng 1 việc để tập trung</p>
            {undoneTasks.length > 0 && (
              <div className="grid gap-1.5">
                {undoneTasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setSelectedTask(t.title);
                      setCustomTask("");
                    }}
                    className={cn(
                      "rounded border px-3 py-2 text-left text-sm transition-colors hover:border-primary",
                      selectedTask === t.title && !customTask.trim()
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-card text-foreground"
                    )}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            )}
            <Input
              className="font-mono text-sm"
              placeholder="Hoặc nhập 1 việc cụ thể..."
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
            />
          </div>

          <Button className="w-full font-mono" size="lg" onClick={startSession}>
            <Play className="mr-2 h-4 w-4" /> Bắt đầu Deep Work ({minutes} phút)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-primary">
            <span className="text-muted-foreground">// </span>hôm_nay
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded border bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Flame className="h-4 w-4 text-primary" /> Tổng phút tập trung
            </div>
            <div className="mt-1 font-mono text-4xl font-bold text-primary">
              {day.focusMinutes ?? 0} <span className="text-base font-normal text-muted-foreground">phút</span>
            </div>
          </div>
          <div className="rounded border bg-muted/30 p-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Coffee className="h-4 w-4 text-destructive" /> Số lần thoát sớm (gãy tập trung)
            </div>
            <div className="mt-1 font-mono text-4xl font-bold text-destructive">
              {day.focusBreaks ?? 0}
            </div>
          </div>
        </CardContent>
      </Card>

      {active && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 p-6 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
            <p className="mb-8 max-w-md font-mono text-sm italic text-muted-foreground">
              &ldquo;{QUOTES[quoteIdx]}&rdquo;
            </p>

            <div className="mb-6 font-mono text-7xl font-bold tracking-tight text-primary [text-shadow:0_0_28px_hsl(var(--primary)/.4)] sm:text-8xl">
              {formatClock(secondsLeft)}
            </div>

            <div className="mb-10 w-full rounded border border-primary/40 bg-card px-5 py-4">
              <p className="mb-1 font-mono text-xs text-muted-foreground">// MỤC TIÊU DUY NHẤT</p>
              <p className="text-lg font-medium text-foreground">{activeTaskTitle}</p>
            </div>

            {completed ? (
              <div className="space-y-4">
                <p className="font-mono text-base font-semibold text-primary">
                  Hoàn thành phiên Deep Work! +{minutes} phút tập trung.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => setActive(false)}>
                    Đóng
                  </Button>
                  <Button onClick={startSession}>Làm thêm phiên nữa</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" size="lg" className="font-mono" onClick={() => setPaused((p) => !p)}>
                  {paused ? (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Tiếp tục
                    </>
                  ) : (
                    <>
                      <Pause className="mr-2 h-4 w-4" /> Tạm dừng
                    </>
                  )}
                </Button>
                <Button variant="destructive" size="lg" className="font-mono" onClick={exitEarly}>
                  <X className="mr-2 h-4 w-4" /> Thoát sớm (+1 break)
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeepWorkPage() {
  return (
    <Suspense fallback={<div className="rounded border bg-card p-5 font-mono text-sm text-muted-foreground">Đang tải Deep Work...</div>}>
      <DeepWorkContent />
    </Suspense>
  );
}
