import { addDays, format } from "date-fns";
import type { DayDoc, Settings } from "./types";

export const dateKey = (d = new Date()) => format(d, "yyyy-MM-dd");
export const DEFAULT_SETTINGS: Settings = {
  good: [
    { id: "g1", title: "Tự học 9 tiếng" }, { id: "g2", title: "Tập gym 2 tiếng" },
    { id: "g3", title: "Đọc sách 15 phút" }, { id: "g4", title: "Ngủ 8 tiếng" },
  ],
  bad: [{ id: "b1", title: "Không cầm điện thoại đầu ngày" }, { id: "b2", title: "Không lướt web vô định" }],
};
export const emptyDay = (): DayDoc => ({ tasks: [], good: {}, bad: {}, reflection: null, focusMinutes: 0, focusBreaks: 0, frozen: false, pct: 0 });

export function calcPct(d: DayDoc, s: Settings) {
  const total = d.tasks.length + s.good.length + s.bad.length;
  if (!total) return 0;
  const done = d.tasks.filter((t) => t.done).length + s.good.filter((h) => d.good[h.id]).length + s.bad.filter((h) => d.bad[h.id]).length;
  return done / total;
}

/** Consecutive 100% days. A frozen day neither adds to nor breaks the streak. */
export function calcStreak(days: Record<string, Pick<DayDoc, "pct" | "frozen">>) {
  let n = 0, d = new Date();
  const t = days[dateKey(d)];
  if (!(t && (t.pct >= 1 || t.frozen))) d = addDays(d, -1);
  for (let i = 0; i < 3650; i++, d = addDays(d, -1)) {
    const x = days[dateKey(d)];
    if (x && x.pct >= 1) n++; else if (!x?.frozen) break;
  }
  return n;
}
