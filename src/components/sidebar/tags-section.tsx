import { CollectionMenu } from "./collection-menu";
import { Plus } from "lucide-react";
import type { NoteFilter, Tag } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export function TagsSection({
  tags,
  filter,
  onFilter,
  onAdd,
  onEdit,
  onDelete,
}: {
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
  tags: Tag[];
  filter: NoteFilter;
  onFilter: (filter: NoteFilter) => void;
  onAdd: () => void;
}) {
  return (
    <section className="mt-5">
      <div className="mb-2 flex items-center justify-between pl-3 pr-1">
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Etiquetas
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label="Añadir etiqueta"
          onClick={onAdd}
        >
          <Plus className="!size-3.5" />
        </Button>
      </div>
      {!tags.length && (
        <p className="px-3 py-2 text-[11px] leading-5 text-muted">
          Crea etiquetas para conectar tus ideas.
        </p>
      )}
      <div className="space-y-0.5">
        {tags.map((tag) => (
          <div key={tag.id} className="group relative">
            <button
              onClick={() => onFilter({ kind: "tag", id: tag.id })}
              className={cn(
                "flex h-8 w-full items-center gap-3 rounded-lg pl-3 pr-8 text-xs text-secondary transition-colors hover:bg-hover hover:text-foreground",
                filter.kind === "tag" &&
                  filter.id === tag.id &&
                  "bg-primary-soft text-primary",
              )}
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                <span className={`tag-dot dot-${tag.color}`} />
              </span>
              <span className="truncate">{tag.name}</span>
            </button>
            <CollectionMenu
              name={tag.name}
              onEdit={() => onEdit(tag)}
              onDelete={() => onDelete(tag)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
