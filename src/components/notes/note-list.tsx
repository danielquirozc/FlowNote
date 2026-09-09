import type { ReactNode } from "react";
import { EmptyNotesState, NotesLoadingSkeleton } from "./notes-states";
import { NoteCard } from "./note-card";
import type { Note, Tag } from "@/types";
export function NoteList({
  notes,
  tags,
  selectedId,
  onSelect,
  onFavorite,
  onStatus,
  onDelete,
  emptyState,
  loading = false,
}: {
  emptyState?: ReactNode;
  loading?: boolean;
  onDelete: (id: string) => void;
  notes: Note[];
  tags: Tag[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onFavorite: (id: string) => void;
  onStatus: (id: string, status: Note["status"]) => void;
}) {
  return (
    <div className="notes-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-2.5 pb-4">
      {loading ? (
        <NotesLoadingSkeleton />
      ) : notes.length ? (
        <div className="space-y-1">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={() => onDelete(note.id)}
              tags={tags}
              selected={selectedId === note.id}
              onSelect={() => onSelect(note.id)}
              onFavorite={() => onFavorite(note.id)}
              onStatus={(status) => onStatus(note.id, status)}
            />
          ))}
        </div>
      ) : (
        (emptyState ?? <EmptyNotesState />)
      )}
    </div>
  );
}
