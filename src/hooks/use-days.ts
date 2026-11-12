"use client";
import { useEffect, useState } from "react";
import { collection, documentId, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { emptyDay } from "@/lib/discipline";
import type { DayDoc } from "@/lib/types";
import { useUid } from "./use-auth";

/** Realtime map of the most recent `max` days, keyed by yyyy-MM-dd. Used by streak, heatmap, report. */
export function useDays(max = 400) {
  const uid = useUid();
  const [days, setDays] = useState<Record<string, DayDoc>>({});
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "users", uid, "days"), orderBy(documentId(), "desc"), limit(max));
    return onSnapshot(q, (s) => {
      const m: Record<string, DayDoc> = {};
      s.forEach((d) => (m[d.id] = { ...emptyDay(), ...(d.data() as Partial<DayDoc>) }));
      setDays(m);
    });
  }, [uid, max]);
  return days;
}
