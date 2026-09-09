import {
  FilePenLine,
  Star,
  Archive,
  Trash2,
  Tag,
  FolderOpen,
  SearchX,
  type LucideIcon,
} from "lucide-react";
import type { NoteFilter } from "@/types";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

function NotesState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center px-5 py-12 text-center"
    >
      <span className="mb-4 flex size-10 items-center justify-center rounded-lg bg-surface text-muted">
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mt-2 max-w-56 text-xs leading-5 text-secondary">
        {description}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function EmptyNotesState({
  onCreate,
  title = "Aún no tienes notas",
  kind = "all",
}: {
  onCreate?: () => void;
  title?: string;
  kind?: NoteFilter["kind"];
}) {
  return (
    <NotesState
      icon={
        {
          all: FilePenLine,
          favorites: Star,
          archived: Archive,
          deleted: Trash2,
          tag: Tag,
          folder: FolderOpen,
        }[kind]
      }
      title={kind === "tag" ? "No hay notas con esta etiqueta" : title}
      description={
        {
          all: "Crea tu primera nota para empezar a escribir.",
          favorites: "Marca una nota como favorita para verla aquí.",
          archived: "Las notas que archives aparecerán aquí.",
          deleted:
            "Las notas eliminadas aparecerán aquí antes de borrarlas para siempre.",
          tag: "Asigna esta etiqueta a una nota para verla aquí.",
          folder: "Añade una nota para organizar tus ideas aquí.",
        }[kind]
      }
    >
      {onCreate && kind !== "archived" && kind !== "deleted" && (
        <Button variant="ghost" size="sm" onClick={onCreate}>
          Crear nota
        </Button>
      )}
    </NotesState>
  );
}

export function EmptyFolderState({ onCreate }: { onCreate?: () => void }) {
  return (
    <NotesState
      icon={FolderOpen}
      title="Esta carpeta está vacía"
      description="Añade una nota para organizar tus ideas aquí."
    >
      {onCreate && (
        <Button variant="ghost" size="sm" onClick={onCreate}>
          Crear nota
        </Button>
      )}
    </NotesState>
  );
}

export function SearchNoResults({ onClear }: { onClear?: () => void }) {
  return (
    <NotesState
      icon={SearchX}
      title="No encontramos resultados"
      description="Prueba con otros términos."
    >
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpiar búsqueda
        </Button>
      )}
    </NotesState>
  );
}

export function NotesLoadingSkeleton() {
  return (
    <div role="status" aria-label="Cargando notas" className="space-y-1">
      <span className="sr-only">Cargando notas…</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="space-y-3 rounded-lg px-3.5 py-4 motion-safe:animate-pulse"
        >
          <div className="h-3.5 w-3/4 rounded bg-hover" />
          <div className="space-y-2">
            <div className="h-2.5 rounded bg-surface" />
            <div className="h-2.5 w-5/6 rounded bg-surface" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-5 w-14 rounded bg-hover" />
            <div className="h-2.5 w-8 rounded bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}
