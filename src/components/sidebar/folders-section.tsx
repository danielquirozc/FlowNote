import { CollectionMenu } from "./collection-menu";
import { Folder as FolderIcon, Plus } from "lucide-react";
import type { Folder, NoteFilter } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function FolderItem({
  folder,
  active,
  onClick,
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
  folder: Folder;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={cn(
          "flex h-8 w-full items-center gap-3 rounded-lg pl-3 pr-8 text-xs text-secondary transition-colors hover:bg-hover hover:text-foreground",
          active && "bg-primary-soft text-primary",
        )}
      >
        <FolderIcon size={16} strokeWidth={1.7} className="shrink-0" />
        <span className="flex-1 truncate text-left">{folder.name}</span>
      </button>
      <CollectionMenu name={folder.name} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
export function FoldersSection({
  folders,
  filter,
  onFilter,
  onAdd,
  onEdit,
  onDelete,
}: {
  onEdit: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  folders: Folder[];
  filter: NoteFilter;
  onFilter: (filter: NoteFilter) => void;
  onAdd: () => void;
}) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between pl-3 pr-1">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Carpetas
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label="Añadir carpeta"
          onClick={onAdd}
        >
          <Plus className="!size-3.5" />
        </Button>
      </div>
      {!folders.length && (
        <p className="px-3 py-2 text-[11px] leading-5 text-muted">
          Crea una carpeta para organizar tus notas.
        </p>
      )}
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          onEdit={() => onEdit(folder)}
          onDelete={() => onDelete(folder)}
          active={filter.kind === "folder" && filter.id === folder.id}
          onClick={() => onFilter({ kind: "folder", id: folder.id })}
        />
      ))}
    </section>
  );
}
