import {
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  Menu,
  Plus,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function NotesHeader({
  title,
  count,
  query,
  onQuery,
  onCreate,
  onMenu,
  sort,
  onSort,
}: {
  title: string;
  count: number;
  query: string;
  onQuery: (value: string) => void;
  onCreate: () => void;
  onMenu: () => void;
  sort: "updated" | "title";
  onSort: (value: "updated" | "title") => void;
}) {
  return (
    <header className="px-5 pt-5">
      <div className="mb-5 flex items-center gap-2">
        <Button
          className="shrink-0 lg:hidden"
          variant="ghost"
          size="icon"
          aria-label="Abrir navegación"
          onClick={onMenu}
        >
          <Menu />
        </Button>
        <div
          role="search"
          className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-soft bg-surface px-3 transition-colors focus-within:border-indigo-200 focus-within:ring-2 focus-within:ring-primary/10"
        >
          <Search size={15} className="shrink-0 text-muted" />
          <input
            id="note-search"
            aria-label="Buscar notas"
            placeholder="Buscar notas..."
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                if (query) onQuery("");
                else event.currentTarget.blur();
              }
            }}
            className="w-full ring-0 min-w-0 bg-transparent text-xs outline-none placeholder:text-muted"
          />
          {query ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
              className="shrink-0 rounded-lg p-1 text-muted hover:bg-hover hover:text-foreground"
              onClick={() => {
                onQuery("");
                document.getElementById("note-search")?.focus();
              }}
            >
              <X size={13} />
            </button>
          ) : (
            <span className="hidden text-[10px] text-muted xl:block">⌘K</span>
          )}
        </div>
        <Button
          size="icon"
          className="size-9 shrink-0"
          aria-label="Crear nota"
          title="Crear nota"
          onClick={onCreate}
        >
          <Plus size={19} />
        </Button>
      </div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-lg font-semibold tracking-[-0.4px]">
            {title}
          </h1>
          <span className="rounded bg-hover px-1.5 py-0.5 text-[10px] text-secondary">
            {count}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Ordenar notas">
              <ArrowDownWideNarrow size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onSort("updated")}>
              {sort === "updated" && <Check />}Última actualización
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSort("title")}>
              {sort === "title" && <Check />}Título, A–Z
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mb-2 flex items-center gap-1 text-[10px] font-medium text-muted">
        {sort === "updated" ? "ÚLTIMA ACTUALIZACIÓN" : "ORDEN ALFABÉTICO"}
        <ChevronDown size={11} />
      </div>
    </header>
  );
}
