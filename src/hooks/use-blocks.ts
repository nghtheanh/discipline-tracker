"use client";
import { useCallback, useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Block } from "@/lib/types";
import { useUid } from "./use-auth";

export function useBlocks() {
  const uid = useUid();
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    if (!uid) return;
    const colRef = collection(db, "users", uid, "blocks");
    return onSnapshot(colRef, (snap) => {
      const list: Block[] = [];
      snap.forEach((d) => {
        const data = d.data() as Omit<Block, "id">;
        list.push({ ...data, id: d.id });
      });
      list.sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);
      setBlocks(list);
    });
  }, [uid]);

  const addBlock = useCallback(
    (block: Omit<Block, "id">) => {
      if (!uid) return;
      const id = crypto.randomUUID();
      return setDoc(doc(db, "users", uid, "blocks", id), block);
    },
    [uid]
  );

  const updateBlock = useCallback(
    (id: string, patch: Partial<Omit<Block, "id">>) => {
      if (!uid) return;
      return updateDoc(doc(db, "users", uid, "blocks", id), patch);
    },
    [uid]
  );

  const removeBlock = useCallback(
    (id: string) => {
      if (!uid) return;
      return deleteDoc(doc(db, "users", uid, "blocks", id));
    },
    [uid]
  );

  return { blocks, addBlock, updateBlock, removeBlock };
}
