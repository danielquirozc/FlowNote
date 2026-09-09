"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionResult, Note } from "@/types";
import type { TiptapDocument } from "@/lib/editor/document";
export type SaveStatus = "saved" | "unsaved" | "saving" | "error";
export type NoteSnapshot = { title: string; content: TiptapDocument };
export interface EditorHandle {
  flush: () => Promise<boolean>;
}

export function useNoteAutosave(
  read: () => NoteSnapshot,
  save: (snapshot: NoteSnapshot) => Promise<ActionResult<Note>>,
) {
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [error, setError] = useState("");
  const callbacks = useRef({ read, save });
  useEffect(() => {
    callbacks.current = { read, save };
  }, [read, save]);
  const revision = useRef(0);
  const acknowledged = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flight = useRef<Promise<boolean> | null>(null);
  const mounted = useRef(true);
  const flush = useCallback(async (): Promise<boolean> => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (flight.current) return flight.current;
    if (revision.current === acknowledged.current) return true;
    // A single flight drains the latest revision. Old responses never replace editor content.
    const run = async () => {
      while (acknowledged.current < revision.current) {
        const sentRevision = revision.current;
        if (mounted.current) {
          setStatus("saving");
          setError("");
        }
        try {
          const snapshot = callbacks.current.read();
          const result = await callbacks.current.save({
            ...snapshot,
            title: snapshot.title.trim() || "Sin título",
          });
          if (!result.success) {
            if (mounted.current) {
              setStatus("error");
              setError(result.error);
            }
            return false;
          }
          acknowledged.current = sentRevision;
        } catch {
          if (mounted.current) {
            setStatus("error");
            setError("No se pudo guardar. Tu borrador sigue aquí.");
          }
          return false;
        }
      }
      if (mounted.current) setStatus("saved");
      return true;
    };
    flight.current = run();
    try {
      return await flight.current;
    } finally {
      flight.current = null;
    }
  }, []);
  const changed = useCallback(() => {
    revision.current += 1;
    if (!flight.current) setStatus("unsaved");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void flush();
    }, 900);
  }, [flush]);
  useEffect(() => {
    mounted.current = true;
    const warn = (event: BeforeUnloadEvent) => {
      if (acknowledged.current < revision.current) event.preventDefault();
    };
    const hide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("visibilitychange", hide);
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [flush]);
  return { status, error, changed, flush };
}
