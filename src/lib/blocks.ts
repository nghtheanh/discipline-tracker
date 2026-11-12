import type { BlockType } from "./types";

export const BLOCK_TYPES: BlockType[] = ["study", "gym", "fun", "other"];

export const BLOCK_META: Record<
  BlockType,
  { label: string; color: string; bg: string; borderClass: string }
> = {
  study: {
    label: "Học tập",
    color: "#38bdf8",
    bg: "rgba(56, 189, 248, 0.14)",
    borderClass: "border-l-sky-400",
  },
  gym: {
    label: "Tập luyện",
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.14)",
    borderClass: "border-l-emerald-400",
  },
  fun: {
    label: "Giải trí",
    color: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.14)",
    borderClass: "border-l-amber-400",
  },
  other: {
    label: "Khác",
    color: "#a78bfa",
    bg: "rgba(167, 139, 250, 0.14)",
    borderClass: "border-l-violet-400",
  },
};

export function minutesToHHMM(min: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, Math.round(min)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function dateToMinutes(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}
