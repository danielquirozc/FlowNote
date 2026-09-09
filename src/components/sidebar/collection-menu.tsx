import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function CollectionMenu({
  name,
  onEdit,
  onDelete,
}: {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Gestionar ${name}`}
          className="absolute right-0 top-0 size-8 text-muted opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 data-[state=open]:opacity-100 max-lg:opacity-100"
        >
          <MoreHorizontal className="!size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onEdit}>
          <PencilLine />
          Renombrar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onDelete} className="text-red-600">
          <Trash2 />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
