"use client";
import { ShareDialog } from "@/components/sharing/share-dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { FilePenLine, X } from "lucide-react";
import { AppSidebar } from "./app-sidebar";
import {
  EmptyNotesState,
  EmptyFolderState,
  SearchNoResults,
} from "@/components/notes/notes-states";
import { NotesPanel } from "@/components/notes/notes-panel";
import { NoteEditor } from "@/components/editor/note-editor";
import { WorkspaceDialogs } from "./workspace-dialogs";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/hooks/use-workspace";
import { useWorkspaceView } from "@/hooks/use-workspace-view";
import type { WorkspaceData } from "@/types";
import { cn } from "@/lib/utils";

export function FlowNoteApp({ initialData }: { initialData: WorkspaceData }) {
  const workspace = useWorkspace(initialData);
  const { notes, tags, folders, user, pending } = workspace;
  const {
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
  } = useWorkspaceView(workspace);
  const sharedNote =
    dialog?.kind === "share"
      ? notes.find((item) => item.id === dialog.noteId)
      : undefined;
  return (
    <main
      className="flex h-dvh overflow-hidden text-foreground"
      aria-busy={pending || signingOut || leaving}
    >
      <fieldset
        disabled={pending || signingOut || leaving}
        className="contents"
      >
        {!expanded && (
          <>
            <AppSidebar
              user={user}
              notes={notes}
              tags={tags}
              folders={folders}
              filter={filter}
              onFilter={changeFilter}
              onSettings={() => setDialog({ kind: "settings" })}
              onAddTag={() => setDialog({ kind: "tag" })}
              onAddFolder={() => setDialog({ kind: "folder" })}
              onEditTag={(tag) => setDialog({ kind: "tag", tag })}
              onEditFolder={(folder) => setDialog({ kind: "folder", folder })}
              onDeleteTag={async (tag) => {
                if (
                  (await canLeave()) &&
                  (await confirm({
                    title: `Eliminar “${tag.name}”`,
                    description: "Las notas se conservarán sin esta etiqueta.",
                    action: "Eliminar etiqueta",
                  }))
                )
                  void workspace.deleteTag(tag.id).then((ok) => {
                    if (ok && filter.kind === "tag" && filter.id === tag.id)
                      setFilter({ kind: "all" });
                  });
              }}
              onDeleteFolder={async (folder) => {
                if (
                  (await canLeave()) &&
                  (await confirm({
                    title: `Eliminar “${folder.name}”`,
                    description: "Las notas se conservarán sin carpeta.",
                    action: "Eliminar carpeta",
                  }))
                )
                  void workspace.deleteFolder(folder.id).then((ok) => {
                    if (
                      ok &&
                      filter.kind === "folder" &&
                      filter.id === folder.id
                    )
                      setFilter({ kind: "all" });
                  });
              }}
              onSignOut={signOut}
              mobileOpen={mobileSidebar}
              onClose={() => setMobileSidebar(false)}
            />
            <div
              className={cn(
                "w-full md:block md:w-auto",
                mobileEditor && "hidden",
              )}
            >
              <NotesPanel
                emptyState={
                  query.trim() ? (
                    <SearchNoResults
                      onClear={async () => {
                        if (await canLeave()) setQuery("");
                      }}
                    />
                  ) : filter.kind === "folder" ? (
                    <EmptyFolderState onCreate={createNote} />
                  ) : (
                    <EmptyNotesState
                      title={emptyTitle}
                      kind={filter.kind}
                      onCreate={createNote}
                    />
                  )
                }
                title={title}
                count={visibleNotes.length}
                query={query}
                onQuery={(value) => {
                  if (!editing && !leaving) setQuery(value);
                  else
                    void canLeave().then((ok) => {
                      if (ok) setQuery(value);
                    });
                }}
                onCreate={createNote}
                onMenu={() => setMobileSidebar(true)}
                sort={sort}
                onSort={async (value) => {
                  if (await canLeave()) setSort(value);
                }}
                notes={visibleNotes}
                tags={tags}
                selectedId={note?.id ?? null}
                onSelect={async (id) => {
                  if (id === note?.id && editing) {
                    setMobileEditor(true);
                    return;
                  }
                  if (await canLeave()) {
                    setSelectedId(id);
                    setMobileEditor(true);
                  }
                }}
                onFavorite={toggleFavorite}
                onStatus={changeStatus}
                onDelete={deleteNote}
              />
            </div>
          </>
        )}
        <div
          className={cn(
            "min-w-0 flex-1 md:flex",
            !mobileEditor && !expanded ? "hidden" : "flex",
          )}
        >
          {note ? (
            <NoteEditor
              key={note.id}
              note={note}
              tags={tags}
              folders={folders}
              editing={editing}
              uploadsEnabled={workspace.uploadsEnabled}
              ref={editorRef}
              frozen={leaving || pending}
              onEdit={() => {
                setSelectedId(note.id);
                setEditing(true);
              }}
              onFinish={async () => {
                await canLeave();
              }}
              onSave={(title, content) =>
                workspace.saveNote(note.id, title, content)
              }
              expanded={expanded}
              onExpand={() => setExpanded((value) => !value)}
              onFavorite={() => toggleFavorite(note.id)}
              onFolder={async (folderId) => {
                if (await canLeave())
                  void workspace.assignFolder(note.id, folderId);
              }}
              onTag={async (id) => {
                if (await canLeave())
                  void workspace.assignTag(
                    note.id,
                    id,
                    !note.tags.includes(id),
                  );
              }}
              onStatus={(status) => changeStatus(note.id, status)}
              onDelete={() => deleteNote(note.id)}
              onShare={async () => {
                if (await canLeave())
                  setDialog({ kind: "share", noteId: note.id });
              }}
              onComments={() => setDialog({ kind: "comments" })}
              onBack={() => {
                setMobileEditor(false);
                setExpanded(false);
              }}
            />
          ) : (
            <section className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <FilePenLine
                size={32}
                strokeWidth={1.2}
                className="mb-4 text-primary/50"
              />
              <h2 className="text-xl font-semibold tracking-tight">
                Espacio para una nueva idea
              </h2>
              <p className="mb-6 mt-2 text-sm text-secondary">
                Crea una nota para empezar a escribir.
              </p>
              <Button onClick={createNote}>Crear nota</Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setMobileEditor(false);
                  setExpanded(false);
                }}
                className="mt-3"
              >
                Volver a las notas
              </Button>
            </section>
          )}
        </div>
      </fieldset>
      <WorkspaceDialogs
        key={
          dialog
            ? `${dialog.kind}-${dialog.kind === "folder" ? dialog.folder?.id : dialog.kind === "tag" ? dialog.tag?.id : note?.id}`
            : "closed"
        }
        dialog={dialog?.kind === "share" ? null : dialog}
        onClose={() => setDialog(null)}
        pending={pending}
        onSave={(name, color) =>
          dialog?.kind === "tag"
            ? workspace.saveTag(dialog.tag?.id, name, color)
            : workspace.saveFolder(
                dialog?.kind === "folder" ? dialog.folder?.id : undefined,
                name,
              )
        }
      />
      <ConfirmationDialog confirmation={confirmation} onRespond={respond} />
      {dialog?.kind === "share" && sharedNote && (
        <ShareDialog
          key={sharedNote.id}
          note={sharedNote}
          pending={pending}
          onChange={(enabled) => workspace.setSharing(sharedNote.id, enabled)}
          onClose={() => setDialog(null)}
        />
      )}
      {(pending || signingOut || leaving) && (
        <div
          role="status"
          className="fixed bottom-3 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-xs text-secondary shadow-sm"
        >
          {signingOut
            ? "Cerrando sesión…"
            : leaving
              ? "Guardando cambios…"
              : "Actualizando…"}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="fixed bottom-12 left-1/2 z-[60] flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center gap-3 rounded-lg border border-red-100 bg-white px-4 py-3 text-xs text-red-700 shadow-sm"
        >
          <span className="flex-1">{error}</span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cerrar mensaje de error"
            onClick={() => {
              workspace.clearError();
              setAuthError("");
            }}
          >
            <X />
          </Button>
        </div>
      )}
    </main>
  );
}
