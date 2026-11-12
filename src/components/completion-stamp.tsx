"use client";
import { motion } from "framer-motion";

/** Big X drawn with framer-motion pathLength + "HOÀN THÀNH" stamp (PRD §2.1). */
export function CompletionStamp() {
  return (
    <div className="pointer-events-none absolute right-4 top-2 h-28 w-36 -rotate-6">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full fill-none stroke-primary/50 stroke-[3]" strokeLinecap="round">
        <motion.path d="M8 8L92 92M92 8L8 92" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: "easeOut" }} />
      </svg>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.b initial={{ opacity: 0, scale: 1.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.3 }}
          className="block whitespace-nowrap rounded border-2 border-primary bg-card px-2.5 py-0.5 font-mono text-sm text-primary">[ HOÀN THÀNH ]</motion.b>
      </div>
    </div>
  );
}
