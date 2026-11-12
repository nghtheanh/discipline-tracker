"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Ctx = createContext<string | null>(null);
export const useUid = () => useContext(Ctx);

/** Anonymous sign-in keeps v1 simple. Swap for Google sign-in later; data paths stay the same. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => (u ? setUid(u.uid) : void signInAnonymously(auth).catch(console.error)));
  }, []);
  return <Ctx.Provider value={uid}>{children}</Ctx.Provider>;
}
