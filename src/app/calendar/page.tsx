"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import FullCalendar, {
  type DateSelectInfo,
  type DayHeaderInfo,
  type EventClickInfo,
  type EventDisplayInfo,
  type EventDropInfo,
  type EventResizeDoneInfo,
} from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import { Check, Flame, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBlocks } from "@/hooks/use-blocks";
import { useDays } from "@/hooks/use-days";
import { BLOCK_META, BLOCK_TYPES, dateToMinutes, minutesToHHMM } from "@/lib/blocks";
import { dateKey } from "@/lib/discipline";
import type { Block, BlockType } from "@/lib/types";
import { cn } from "@/lib/utils";

type DraftRange = { date: string; start: number; end: number };

export default function CalendarPage() {
  const { blocks, addBlock, updateBlock, removeBlock } = useBlocks();
  const days = useDays(90);

  const [createOpen, setCreateOpen] = useState(false);
  const [draftRange, setDraftRange] = useState<DraftRange | null>(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<BlockType>("study");

  const [editing, setEditing] = useState<Block | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<BlockType>("study");

  const events = useMemo(
    () =>
      blocks.map((b) => {
        const meta = BLOCK_META[b.type];
        return {
          id: b.id,
          title: b.title,
          start: `${b.date}T${minutesToHHMM(b.start)}:00`,
          end: `${b.date}T${minutesToHHMM(b.end)}:00`,
          backgroundColor: meta.bg,
          borderColor: "transparent",
          textColor: "#e2e8f0",
          extendedProps: { block: b },
        };
      }),
    [blocks]
  );

  const handleSelect = (arg: DateSelectInfo) => {
    const start = dateToMinutes(arg.start);
    const rawEnd = dateToMinutes(arg.end);
    const end = rawEnd > start ? rawEnd : Math.min(24 * 60, start + 30);
    setDraftRange({ date: dateKey(arg.start), start, end });
    setTitle("");
    setType("study");
    setCreateOpen(true);
  };

  const handleCreate = () => {
    if (!draftRange || !title.trim()) return;
    addBlock({
      date: draftRange.date,
      start: draftRange.start,
      end: draftRange.end,
      type,
      title: title.trim(),
      done: false,
    });
    setCreateOpen(false);
  };

  const syncTimes = (id: string, startDate: Date | null, endDate: Date | null) => {
    if (!startDate || !endDate) return;
    const start = dateToMinutes(startDate);
    const rawEnd = dateToMinutes(endDate);
    const end = rawEnd > start ? rawEnd : Math.min(24 * 60, start + 30);
    updateBlock(id, { date: dateKey(startDate), start, end });
  };

  const handleEventDrop = (arg: EventDropInfo) => {
    syncTimes(arg.event.id, arg.event.start, arg.event.end);
  };

  const handleEventResize = (arg: EventResizeDoneInfo) => {
    syncTimes(arg.event.id, arg.event.start, arg.event.end);
  };

  const handleEventClick = (arg: EventClickInfo) => {
    const b = arg.event.extendedProps.block as Block | undefined;
    if (!b) return;
    setEditing(b);
    setEditTitle(b.title);
    setEditType(b.type);
  };

  const renderEventContent = (arg: EventDisplayInfo) => {
    const b = arg.event.extendedProps.block as Block | undefined;
    if (!b) return null;
    const meta = BLOCK_META[b.type];
    return (
      <div
        className={cn(
          "flex h-full flex-col justify-between overflow-hidden border-l-4 px-1.5 py-0.5 text-xs",
          meta.borderClass,
          b.done && "opacity-60"
        )}
      >
        <div className="flex items-center gap-1 truncate font-medium">
          {b.done && <Check className="h-3 w-3 shrink-0 text-primary" />}
          <span className={cn("truncate", b.done && "line-through")}>{b.title}</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{arg.timeText}</span>
      </div>
    );
  };

  const renderDayHeader = (arg: DayHeaderInfo) => {
    const k = dateKey(arg.date);
    const completed = (days[k]?.pct ?? 0) >= 1;
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span>{arg.text}</span>
        {completed && (
          <span
            title="Hoàn thành 100% kỷ luật"
            className="font-mono font-bold text-primary [text-shadow:0_0_8px_hsl(var(--primary)/.6)]"
          >
            ✕
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-mono text-sm text-primary">
            <span className="text-muted-foreground">// </span>lịch_time_boxing
          </h2>
          <div className="flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
            {BLOCK_TYPES.map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: BLOCK_META[t].color }} />
                {BLOCK_META[t].label}
              </span>
            ))}
          </div>
        </div>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale="vi"
          firstDay={1}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridWeek,timeGridDay",
          }}
          allDaySlot={false}
          slotMinTime="05:00:00"
          slotMaxTime="24:00:00"
          slotDuration="00:30:00"
          height="auto"
          nowIndicator
          selectable
          selectMirror
          editable
          events={events}
          select={handleSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          dayHeaderContent={renderDayHeader}
        />
      </Card>

      {/* Create Block Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-primary">// tạo_block_mới</DialogTitle>
          </DialogHeader>
          {draftRange && (
            <p className="font-mono text-xs text-muted-foreground">
              {draftRange.date} • {minutesToHHMM(draftRange.start)} – {minutesToHHMM(draftRange.end)}
            </p>
          )}
          <div className="grid gap-3 py-2">
            <Input
              autoFocus
              placeholder="Tên công việc / block..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
            />
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex items-center gap-2 rounded border border-l-4 px-3 py-2 text-left font-mono text-xs transition-colors",
                    BLOCK_META[t].borderClass,
                    type === t ? "border-primary bg-primary/10 text-primary" : "bg-card text-foreground"
                  )}
                >
                  {BLOCK_META[t].label}
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Hủy</Button>
            <Button onClick={handleCreate} disabled={!title.trim()}>Lưu block</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Block Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-primary">// chi_tiết_block</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3 py-2">
              <p className="font-mono text-xs text-muted-foreground">
                {editing.date} • {minutesToHHMM(editing.start)} – {minutesToHHMM(editing.end)}
              </p>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                {BLOCK_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEditType(t)}
                    className={cn(
                      "flex items-center gap-2 rounded border border-l-4 px-3 py-2 text-left font-mono text-xs",
                      BLOCK_META[t].borderClass,
                      editType === t ? "border-primary bg-primary/10 text-primary" : "bg-card text-foreground"
                    )}
                  >
                    {BLOCK_META[t].label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  type="button"
                  variant={editing.done ? "secondary" : "outline"}
                  size="sm"
                  className="font-mono text-xs"
                  onClick={() => {
                    updateBlock(editing.id, { done: !editing.done });
                    setEditing({ ...editing, done: !editing.done });
                  }}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  {editing.done ? "Đã hoàn thành" : "Đánh dấu xong"}
                </Button>
                {editType === "study" && (
                  <Button asChild size="sm" variant="outline" className="font-mono text-xs">
                    <Link href={`/deep-work?task=${encodeURIComponent(editTitle)}`}>
                      <Flame className="mr-1.5 h-3.5 w-3.5 text-primary" /> Vào Deep Work
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-row justify-between sm:justify-between">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (!editing) return;
                removeBlock(editing.id);
                setEditing(null);
              }}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Xóa
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>Đóng</Button>
              <Button
                onClick={() => {
                  if (!editing || !editTitle.trim()) return;
                  updateBlock(editing.id, { title: editTitle.trim(), type: editType });
                  setEditing(null);
                }}
              >
                Cập nhật
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
