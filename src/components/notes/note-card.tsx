import { Archive, MoreHorizontal, RotateCcw, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TagBadge } from "./tag-badge";
import { cn } from "@/lib/utils";
import type { Note, Tag } from "@/types";
export function noteDate(date: string) {
  return new Intl.DateTimeFormat("es-DO", {
    timeZone: "America/Santo_Domingo",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
export function NoteCard({
  note,
  tags,
  selected,
  onSelect,
  onFavorite,
  onStatus,
  onDelete,
}: {
  note: Note;
  tags: Tag[];
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
  onStatus: (status: Note["status"]) => void;
  onDelete: () => void;
}) {
  return (
    <article
      className={cn(
        "note-card group relative rounded-lg border transition-colors",
        selected
          ? "border-selection-border bg-selection"
          : "border-transparent hover:bg-surface",
      )}
    >
      <button
        onClick={onSelect}
        aria-pressed={selected}
        className="block w-full rounded-lg px-3.5 py-3.5 text-left"
      >
        <div className="mb-1.5 flex items-center gap-1.5 pr-5">
          <h2 className="truncate text-[13px] font-semibold tracking-[-0.2px]">
            {note.title || "Sin título"}
          </h2>
          {note.favorite && (
            <Star
              size={11}
              className="shrink-0 fill-[#b7b2e3] text-[#b7b2e3]"
            />
          )}
        </div>
        <p className="line-clamp-2 text-xs leading-[1.7] text-secondary">
          {note.preview || "Una página nueva. ¿Qué tienes en mente?"}
        </p>
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((id) => {
              const tag = tags.find((t) => t.id === id);
              return tag && <TagBadge key={id} tag={tag} />;
            })}
          </div>
          <time
            dateTime={note.updatedAt}
            className="shrink-0 text-[10px] text-muted"
          >
            {noteDate(note.updatedAt)}
          </time>
        </div>
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2.5 size-7 text-muted md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:focus:opacity-100 data-[state=open]:opacity-100"
            aria-label={`Opciones de ${note.title}`}
          >
            <MoreHorizontal className="!size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={note.status === "deleted"}
            onSelect={onFavorite}
          >
            <Star />
            {note.favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          </DropdownMenuItem>
          {note.status !== "active" ? (
            <DropdownMenuItem onSelect={() => onStatus("active")}>
              <RotateCcw />
              {note.status === "deleted"
                ? "Restaurar nota"
                : "Desarchivar nota"}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => onStatus("archived")}>
              <Archive />
              Archivar nota
            </DropdownMenuItem>
          )}
          {note.status === "deleted" && (
            <DropdownMenuItem onSelect={onDelete} className="text-red-600">
              <Trash2 />
              Eliminar permanentemente
            </DropdownMenuItem>
          )}
          {note.status !== "deleted" && (
            <DropdownMenuItem
              onSelect={() => onStatus("deleted")}
              className="text-red-600"
            >
              <Trash2 />
              Mover a la papelera
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </article>
  );
}
