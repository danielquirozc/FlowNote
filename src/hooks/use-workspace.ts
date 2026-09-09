"use client";
import {
  useRef,
  useState,
  useTransition,
  useCallback,
  startTransition,
} from "react";
import * as noteActions from "@/actions/notes";
import * as folderActions from "@/actions/folders";
import * as tagActions from "@/actions/tags";
import type { TiptapDocument } from "@/lib/editor/document";
import type { ActionResult, Note, TagColor, WorkspaceData } from "@/types";

export function useWorkspace(initialData: WorkspaceData) {
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [pending, startMutationTransition] = useTransition();
  const lock = useRef(false);
  function perform<T>(
    action: () => Promise<ActionResult<T>>,
    commit: (value: T) => void,
  ): Promise<boolean> {
    if (lock.current) return Promise.resolve(false);
    lock.current = true;
    setError("");
    return new Promise((resolve) => {
      startMutationTransition(async () => {
        try {
          const result = await action();
          if (result.success) {
            commit(result.data);
            resolve(true);
          } else {
            setError(result.error);
            resolve(false);
          }
        } catch {
          setError(
            "No se pudo conectar. Tus cambios no se guardaron. Inténtalo de nuevo.",
          );
          resolve(false);
        } finally {
          lock.current = false;
        }
      });
    });
  }
  function replaceNote(note: Note) {
    setData((current) => ({
      ...current,
      notes: current.notes.map((n) => (n.id === note.id ? note : n)),
    }));
  }
  const autosaveNote = useCallback(
    (
      id: string,
      title: string,
      content: TiptapDocument,
    ): Promise<ActionResult<Note>> =>
      new Promise((resolve) => {
        startTransition(async () => {
          try {
            const result = await noteActions.saveNote({ id, title, content });
            if (result.success)
              setData((current) => ({
                ...current,
                notes: current.notes.map((note) =>
                  note.id === id ? result.data : note,
                ),
              }));
            resolve(result);
          } catch {
            resolve({
              success: false,
              error: "No se pudo conectar. Tu borrador no se ha guardado.",
            });
          }
        });
      }),
    [],
  );
  return {
    ...data,
    error,
    pending,
    clearError: () => setError(""),
    createNote: (
      input: { folderId?: string; tagId?: string; favorite?: boolean },
      onCreated: (note: Note) => void,
    ) =>
      perform(
        () => noteActions.createNote(input),
        (note) => {
          setData((current) => ({
            ...current,
            notes: [note, ...current.notes],
          }));
          onCreated(note);
        },
      ),
    saveNote: autosaveNote,
    setSharing: (id: string, enabled: boolean) =>
      perform(() => noteActions.setNoteSharing({ id, enabled }), replaceNote),
    changeState: (
      id: string,
      operation: "favorite" | "archive" | "unarchive" | "trash" | "restore",
    ) =>
      perform(
        () => noteActions.changeNoteState({ id, operation }),
        replaceNote,
      ),
    deleteNote: (id: string) =>
      perform(
        () => noteActions.permanentlyDeleteNote(id),
        (deletedId) =>
          setData((current) => ({
            ...current,
            notes: current.notes.filter((n) => n.id !== deletedId),
          })),
      ),
    assignFolder: (id: string, folderId: string | null) =>
      perform(() => noteActions.assignFolder({ id, folderId }), replaceNote),
    assignTag: (id: string, tagId: string, assigned: boolean) =>
      perform(
        () => noteActions.assignTag({ id, tagId, assigned }),
        replaceNote,
      ),
    saveFolder: (id: string | undefined, name: string) =>
      perform(
        () =>
          id
            ? folderActions.renameFolder({ id, name })
            : folderActions.createFolder(name),
        (folder) =>
          setData((current) => ({
            ...current,
            folders: [
              ...current.folders.filter((f) => f.id !== folder.id),
              folder,
            ].sort((a, b) => a.name.localeCompare(b.name)),
          })),
      ),
    deleteFolder: (id: string) =>
      perform(
        () => folderActions.deleteFolder(id),
        (deletedId) =>
          setData((current) => ({
            ...current,
            folders: current.folders.filter((f) => f.id !== deletedId),
            notes: current.notes.map((n) =>
              n.folderId === deletedId ? { ...n, folderId: null } : n,
            ),
          })),
      ),
    saveTag: (id: string | undefined, name: string, color: TagColor) =>
      perform(
        () =>
          id
            ? tagActions.renameTag({ id, name, color })
            : tagActions.createTag({ name, color }),
        (tag) =>
          setData((current) => ({
            ...current,
            tags: [...current.tags.filter((t) => t.id !== tag.id), tag].sort(
              (a, b) => a.name.localeCompare(b.name),
            ),
          })),
      ),
    deleteTag: (id: string) =>
      perform(
        () => tagActions.deleteTag(id),
        (deletedId) =>
          setData((current) => ({
            ...current,
            tags: current.tags.filter((t) => t.id !== deletedId),
            notes: current.notes.map((n) => ({
              ...n,
              tags: n.tags.filter((t) => t !== deletedId),
            })),
          })),
      ),
  };
}
