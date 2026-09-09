import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { EditorCommand } from "@/lib/editor/commands";
import { cn } from "@/lib/utils";
export interface SlashMenuProps {
  items: EditorCommand[];
  command: (command: EditorCommand) => void;
  query: string;
}
export interface SlashMenuHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}
export const SlashCommandMenu = forwardRef<SlashMenuHandle, SlashMenuProps>(
  function SlashCommandMenu({ items, command, query }, ref) {
    const [selection, setSelection] = useState({ query, index: 0 });
    const index =
      selection.query === query
        ? Math.min(selection.index, Math.max(0, items.length - 1))
        : 0;
    const container = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
      container.current
        ?.querySelector('[aria-selected="true"]')
        ?.scrollIntoView({ block: "nearest" });
    }, [index, query]);
    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        if (!["ArrowUp", "ArrowDown", "Enter"].includes(event.key))
          return false;
        event.preventDefault();
        if (event.key === "Enter") {
          if (items[index]) command(items[index]);
        } else if (items.length)
          setSelection({
            query,
            index:
              (index + (event.key === "ArrowDown" ? 1 : -1) + items.length) %
              items.length,
          });
        return true;
      },
    }));
    return (
      <div
        ref={container}
        role="listbox"
        aria-label="Insertar bloque"
        className="max-h-[min(340px,50vh)] w-64 overflow-y-auto rounded-lg border border-border bg-white p-1.5 shadow-lg shadow-black/5"
      >
        <p className="px-2 py-2 text-[10px] font-medium uppercase tracking-wider text-muted">
          Insertar bloque
        </p>
        {items.length ? (
          items.map((item, i) => (
            <button
              type="button"
              role="option"
              aria-selected={i === index}
              key={item.id}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => command(item)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left",
                i === index
                  ? "bg-primary-soft text-primary"
                  : "text-secondary hover:bg-hover",
              )}
            >
              <item.icon size={16} />
              <span>
                <span className="block text-xs font-medium">{item.label}</span>
                <span className="mt-0.5 block text-[10px] text-secondary">
                  {item.detail}
                </span>
              </span>
            </button>
          ))
        ) : (
          <p className="px-2 py-5 text-xs text-secondary">
            No se encontraron comandos
          </p>
        )}
      </div>
    );
  },
);
