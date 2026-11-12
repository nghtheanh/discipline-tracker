"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export type Row = { id: string; title: string; done: boolean };
type Props = { title: string; hint?: string; placeholder: string; rows: Row[]; onToggle: (id: string) => void; onAdd: (t: string) => void; onRemove: (id: string) => void };

export function ChecklistCard({ title, hint, placeholder, rows, onToggle, onAdd, onRemove }: Props) {
  const [v, setV] = useState("");
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-sm text-primary"><span className="text-muted-foreground">// </span>{title}</CardTitle>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardHeader>
      <CardContent>
        {rows.map((r) => (
          <div key={r.id} className="flex items-center gap-3 border-b py-2">
            <Checkbox id={r.id} checked={r.done} onCheckedChange={() => onToggle(r.id)} />
            <label htmlFor={r.id} className={`flex-1 ${r.done ? "text-muted-foreground line-through" : ""}`}>{r.title}</label>
            <button onClick={() => onRemove(r.id)} aria-label="Xóa" className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        ))}
        <Input className="mt-3 font-mono text-sm" value={v} placeholder={placeholder} onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && v.trim()) { onAdd(v.trim()); setV(""); } }} />
      </CardContent>
    </Card>
  );
}
