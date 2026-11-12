"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  dayKey: string;
  loaded: boolean;
  reflection: [string, string, string] | null;
  onSave: (reflection: [string, string, string]) => void;
};

const QUESTIONS = [
  { label: "1. Điều làm tốt hôm nay", placeholder: "Hôm nay bạn đã giữ kỷ luật ở điểm nào?" },
  { label: "2. Điều gây xao nhãng", placeholder: "Khoảnh khắc nào làm bạn mất tập trung hoặc chệch nhịp?" },
  { label: "3. Lời nhắc cho ngày mai", placeholder: "Một điều cụ thể cần làm tốt hơn vào ngày mai..." },
] as const;

function isPast2245(now = new Date()): boolean {
  return now.getHours() * 60 + now.getMinutes() >= 22 * 60 + 45;
}

export function DailyReflection({ dayKey, loaded, reflection, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const [fields, setFields] = useState<[string, string, string]>(["", "", ""]);

  useEffect(() => {
    setFields(reflection ?? ["", "", ""]);
  }, [reflection]);

  useEffect(() => {
    if (!loaded || reflection !== null || dismissedKey === dayKey) return;
    const check = () => {
      if (isPast2245()) setOpen(true);
    };
    check();
    const timer = setInterval(check, 30_000);
    return () => clearInterval(timer);
  }, [loaded, reflection, dismissedKey, dayKey]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setDismissedKey(dayKey);
  };

  const handleSave = () => {
    const trimmed: [string, string, string] = [fields[0].trim(), fields[1].trim(), fields[2].trim()];
    onSave(trimmed);
    setOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-mono text-sm text-primary">
            <span className="text-muted-foreground">// </span>nhật_ký_phản_tỉnh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {reflection ? (
            <div className="space-y-1.5 text-muted-foreground">
              <p><span className="text-foreground">Làm tốt:</span> {reflection[0] || "—"}</p>
              <p><span className="text-foreground">Xao nhãng:</span> {reflection[1] || "—"}</p>
              <p><span className="text-foreground">Nhắc ngày mai:</span> {reflection[2] || "—"}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Tự động mở lúc 22:45 nếu chưa ghi. Bạn có thể ghi bất cứ lúc nào.</p>
          )}
          <Button variant="outline" size="sm" className="font-mono" onClick={() => setOpen(true)}>
            {reflection ? "Sửa nhật ký" : "Viết nhật ký ngay"}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono text-primary">// nhật_ký_phản_tỉnh ({dayKey})</DialogTitle>
            <DialogDescription>
              Dành 2 phút nhìn lại ngày hôm nay trước khi kết thúc.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            {QUESTIONS.map((q, i) => (
              <div key={q.label} className="grid gap-1.5">
                <label className="font-mono text-xs text-muted-foreground">{q.label}</label>
                <Textarea
                  rows={2}
                  value={fields[i]}
                  placeholder={q.placeholder}
                  onChange={(e) => {
                    const next: [string, string, string] = [...fields] as [string, string, string];
                    next[i] = e.target.value;
                    setFields(next);
                  }}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>Để sau</Button>
            <Button onClick={handleSave}>Lưu phản tỉnh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
