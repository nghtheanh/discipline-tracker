"use client";
import { useCallback, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_SETTINGS, calcPct, dateKey, emptyDay } from "@/lib/discipline";
import type { DayDoc, Settings } from "@/lib/types";
import { useUid } from "./use-auth";

export function useToday() {
  const uid = useUid(), key = dateKey();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [day, setDay] = useState<DayDoc>(emptyDay());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!uid) return;
    const sRef = doc(db, "users", uid, "settings", "main"), dRef = doc(db, "users", uid, "days", key);
    const u1 = onSnapshot(sRef, (s) => (s.exists() ? setSettings(s.data() as Settings) : void setDoc(sRef, DEFAULT_SETTINGS)));
    const u2 = onSnapshot(dRef, (s) => {
      setDay({ ...emptyDay(), ...(s.data() as Partial<DayDoc>) });
      setLoaded(true);
    });
    return () => { u1(); u2(); };
  }, [uid, key]);

  const saveDay = useCallback((patch: Partial<DayDoc>) => {
    if (!uid) return;
    const next = { ...day, ...patch }; next.pct = calcPct(next, settings);
    setDay(next);
    return setDoc(doc(db, "users", uid, "days", key), next);
  }, [uid, key, day, settings]);

  const saveSettings = (s: Settings) => {
    if (!uid) return;
    setSettings(s);
    setDoc(doc(db, "users", uid, "settings", "main"), s);
    setDoc(doc(db, "users", uid, "days", key), { ...day, pct: calcPct(day, s) });
  };

  return {
    key, day, settings, loaded, saveDay,
    toggleTask: (id: string) => saveDay({ tasks: day.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }),
    addTask: (title: string) => saveDay({ tasks: [...day.tasks, { id: crypto.randomUUID(), title, done: false }] }),
    removeTask: (id: string) => saveDay({ tasks: day.tasks.filter((t) => t.id !== id) }),
    toggleHabit: (kind: "good" | "bad", id: string) => saveDay({ [kind]: { ...day[kind], [id]: !day[kind][id] } } as Partial<DayDoc>),
    addHabit: (kind: "good" | "bad", title: string) => saveSettings({ ...settings, [kind]: [...settings[kind], { id: crypto.randomUUID(), title }] }),
    removeHabit: (kind: "good" | "bad", id: string) => saveSettings({ ...settings, [kind]: settings[kind].filter((h) => h.id !== id) }),
    toggleFreeze: () => saveDay({ frozen: !day.frozen }),
  };
}
