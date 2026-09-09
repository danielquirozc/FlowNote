"use client";
import { useEffect, useState, useRef } from "react";
import { useConfirmation } from "./use-confirmation";
import { authClient } from "@/lib/auth-client";
import { getPlainTextFromTiptapDocument } from "@/lib/editor/document";
import type { EditorHandle } from "./use-note-autosave";
import type { Note, NoteFilter } from "@/types";
import type { DialogState } from "@/components/layout/workspace-dialogs";
import type { useWorkspace } from "./use-workspace";

export function useWorkspaceView(workspace: ReturnType<typeof useWorkspace>) {
  const { notes, tags, folders, pending } = workspace;
  const { confirmation, confirm, respond } = useConfirmation();
  const editorRef = useRef<EditorHandle>(null);
  const navigationLock = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const session = authClient.useSession();
  const [filter, setFilter] = useState<NoteFilter>({ kind: "all" });
  const [selectedId, setSelectedId] = useState<string | null>(
    notes.find((n) => n.status === "active")?.id ?? null,
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"updated" | "title">("updated");
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mobileEditor, setMobileEditor] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [authError, setAuthError] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  useEffect(() => {
    if (!editing && !session.isPending && !session.error && !session.data)
      window.location.replace("/sign-in");
  }, [editing, session.isPending, session.error, session.data]);
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (event.defaultPrevented || document.querySelector('[role="dialog"]'))
        return;
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setExpanded(false);
        setMobileEditor(false);
        requestAnimationFrame(() =>
          document.getElementById("note-search")?.focus(),
        );
      }
      if (event.key === "Escape") setExpanded(false);
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);
  const visibleNotes = notes
    .filter((n) => {
      const matches =
        filter.kind === "deleted"
          ? n.status === "deleted"
          : filter.kind === "archived"
            ? n.status === "archived"
            : filter.kind === "favorites"
              ? n.status !== "deleted" && n.favorite
              : n.status === "active" &&
                (filter.kind === "folder"
                  ? n.folderId === filter.id
                  : filter.kind === "tag"
                    ? n.tags.includes(filter.id)
                    : true);
      return (
        matches &&
        `${n.title}\n${getPlainTextFromTiptapDocument(n.content)}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      );
    })
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title, "es-DO")
        : b.updatedAt.localeCompare(a.updatedAt),
    );
  const note =
    (editing
      ? notes.find((n) => n.id === selectedId)
      : visibleNotes.find((n) => n.id === selectedId)) ?? visibleNotes[0];
  const title =
    filter.kind === "tag"
      ? (tags.find((t) => t.id === filter.id)?.name ?? "Etiquetas")
      : filter.kind === "folder"
        ? (folders.find((f) => f.id === filter.id)?.name ?? "Carpetas")
        : {
            all: "Todas las notas",
            favorites: "Favoritos",
            archived: "Archivadas",
            deleted: "Eliminadas recientemente",
          }[filter.kind];
  async function canLeave() {
    if (pending || signingOut || navigationLock.current) return false;
    navigationLock.current = true;
    setLeaving(true);
    try {
      if (editorRef.current && !(await editorRef.current.flush())) return false;
      setEditing(false);
      return true;
    } finally {
      navigationLock.current = false;
      setLeaving(false);
    }
  }
  async function changeFilter(next: NoteFilter) {
    if (!(await canLeave())) return;
    setFilter(next);
    setQuery("");
    setMobileSidebar(false);
    setMobileEditor(false);
  }
  async function createNote() {
    if (!(await canLeave())) return;
    void workspace.createNote(
      {
        ...(filter.kind === "folder" ? { folderId: filter.id } : {}),
        ...(filter.kind === "tag" ? { tagId: filter.id } : {}),
        favorite: filter.kind === "favorites",
      },
      (fresh) => {
        if (filter.kind === "archived" || filter.kind === "deleted")
          setFilter({ kind: "all" });
        setQuery("");
        setSelectedId(fresh.id);
        setEditing(true);
        setMobileEditor(true);
      },
    );
  }
  async function changeStatus(id: string, status: Note["status"]) {
    if (!(await canLeave())) return;
    const previous = notes.find((n) => n.id === id);
    const operation =
      status === "archived"
        ? "archive"
        : status === "deleted"
          ? "trash"
          : previous?.status === "deleted"
            ? "restore"
            : "unarchive";
    void workspace.changeState(id, operation);
  }
  async function deleteNote(id: string) {
    if (
      (await canLeave()) &&
      (await confirm({
        title: "Eliminar nota permanentemente",
        description: "Esta acción no se puede deshacer.",
        action: "Eliminar permanentemente",
      }))
    )
      void workspace.deleteNote(id);
  }
  async function toggleFavorite(id: string) {
    if (await canLeave()) void workspace.changeState(id, "favorite");
  }
  async function signOut() {
    if (!(await canLeave())) return;
    setSigningOut(true);
    setAuthError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setAuthError("No se pudo cerrar sesión. Inténtalo de nuevo.");
        setSigningOut(false);
      } else window.location.replace("/sign-in");
    } catch {
      setAuthError("No se pudo cerrar sesión. Inténtalo de nuevo.");
      setSigningOut(false);
    }
  }
  const emptyTitle =
    filter.kind === "favorites"
      ? "Aún no tienes notas favoritas"
      : filter.kind === "archived"
        ? "No hay notas archivadas"
        : filter.kind === "deleted"
          ? "La papelera está vacía"
          : "Aún no tienes notas";
  const error = workspace.error || authError;
  return {
    confirmation,
    confirm,
    respond,
    editorRef,
    leaving,
    filter,
    setFilter,
    query,
    setQuery,
    sort,
    setSort,
    editing,
    setEditing,
    expanded,
    setExpanded,
    mobileEditor,
    setMobileEditor,
    mobileSidebar,
    setMobileSidebar,
    dialog,
    setDialog,
    setAuthError,
    signingOut,
    visibleNotes,
    note,
    title,
    canLeave,
    changeFilter,
    createNote,
    changeStatus,
    deleteNote,
    toggleFavorite,
    signOut,
    emptyTitle,
    error,
    setSelectedId,
  };
}
