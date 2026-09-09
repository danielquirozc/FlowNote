import {
  Archive,
  ArrowLeft,
  Check,
  ChevronDown,
  Folder,
  Maximize2,
  MessageSquare,
  Minimize2,
  MoreHorizontal,
  RotateCcw,
  Share2,
  Star,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Folder as FolderType, Note, Tag } from "@/types";
interface Props {
  note: Note;
  folders: FolderType[];
  tags: Tag[];
  expanded: boolean;
  onExpand: () => void;
  onFavorite: () => void;
  onFolder: (id: string | null) => void;
  onTag: (id: string) => void;
  onStatus: (status: Note["status"]) => void;
  onDelete: () => void;
  onShare: () => void;
  onComments: () => void;
  onBack: () => void;
}
export function EditorToolbar({
  note,
  folders,
  tags,
  expanded,
  onExpand,
  onFavorite,
  onFolder,
  onTag,
  onStatus,
  onDelete,
  onShare,
  onComments,
  onBack,
}: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-soft px-5 xl:px-8">
      <div className="flex min-w-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Volver a las notas"
          onClick={onBack}
        >
          <ArrowLeft />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              disabled={note.status === "deleted"}
              className="mr-2 min-w-0 max-w-36 gap-2"
            >
              <Folder />
              <span className="truncate text-xs">
                {folders.find((f) => f.id === note.folderId)?.name ||
                  "Sin carpeta"}
              </span>
              <ChevronDown className="!size-3 text-muted" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => onFolder(null)}>
              <Folder />
              Sin carpeta{!note.folderId && <Check className="ml-auto" />}
            </DropdownMenuItem>
            {folders.map((folder) => (
              <DropdownMenuItem
                key={folder.id}
                onSelect={() => onFolder(folder.id)}
              >
                <Folder />
                {folder.name}
                {note.folderId === folder.id && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Gestionar etiquetas de la nota"
              disabled={note.status === "deleted"}
            >
              <TagIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {!tags.length && (
              <p className="px-3 py-2 text-xs text-secondary">
                Aún no tienes etiquetas.
              </p>
            )}
            {tags.map((tag) => (
              <DropdownMenuItem key={tag.id} onSelect={() => onTag(tag.id)}>
                {tag.name}
                {note.tags.includes(tag.id) && <Check className="ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            note.favorite ? "Quitar de favoritos" : "Añadir a favoritos"
          }
          aria-pressed={note.favorite}
          disabled={note.status === "deleted"}
          onClick={onFavorite}
        >
          <Star
            className={note.favorite ? "fill-[#f0eddc] text-[#b5a777]" : ""}
          />
        </Button>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          aria-label={
            expanded ? "Salir del modo enfoque" : "Entrar en modo enfoque"
          }
          onClick={onExpand}
        >
          {expanded ? <Minimize2 /> : <Maximize2 />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Abrir comentarios"
          onClick={onComments}
        >
          <MessageSquare />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={note.status === "deleted"}
          onClick={onShare}
          className="gap-2 text-xs"
          aria-label="Compartir nota"
        >
          <Share2 />
          <span className="hidden sm:inline">Compartir</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Más acciones de la nota"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                className="text-red-600"
                onSelect={() => onStatus("deleted")}
              >
                <Trash2 />
                Mover a la papelera
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
