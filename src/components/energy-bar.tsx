"use client";
import { motion } from "framer-motion";

export function EnergyBar({ value }: { value: number }) {
  const pc = Math.round(value * 100);
  return (
    <div role="progressbar" aria-valuenow={pc} className="relative h-9 overflow-hidden rounded border bg-background shadow-[0_0_18px_hsl(var(--primary)/.15)]">
      <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-700 to-primary" initial={false} animate={{ width: `${pc}%` }} transition={{ duration: 0.5 }} />
      <span className="absolute left-3 top-1.5 font-mono text-sm font-semibold text-white [text-shadow:0_1px_3px_#000]">năng_lượng: {pc}%</span>
    </div>
  );
}
