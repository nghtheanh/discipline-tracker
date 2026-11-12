export type Habit = { id: string; title: string };
export type Task = { id: string; title: string; done: boolean };
export type Settings = { good: Habit[]; bad: Habit[] };
export type BlockType = "study" | "gym" | "fun" | "other";
/** users/{uid}/days/{yyyy-MM-dd} — `pct` is stored so heatmap/report never recompute history */
export type DayDoc = {
  tasks: Task[]; good: Record<string, boolean>; bad: Record<string, boolean>;
  reflection: [string, string, string] | null;
  focusMinutes: number; focusBreaks: number; frozen: boolean; pct: number;
};
/** users/{uid}/blocks/{id} — start/end are minutes since 00:00 */
export type Block = { id: string; date: string; start: number; end: number; type: BlockType; title: string; done: boolean };
