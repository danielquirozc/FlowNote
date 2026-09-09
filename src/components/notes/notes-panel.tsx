import { NotesHeader } from "./notes-header";
import { NoteList } from "./note-list";
import type { ComponentProps } from "react";
export function NotesPanel(
  props: ComponentProps<typeof NotesHeader> & ComponentProps<typeof NoteList>,
) {
  return (
    <section
      aria-label="Notas"
      className="notes-panel flex h-dvh w-full shrink-0 flex-col border-r border-soft bg-white md:w-[320px] xl:w-[344px]"
    >
      <NotesHeader {...props} />
      <NoteList {...props} />
      <footer className="flex h-9 shrink-0 items-center justify-between border-t border-soft px-5 text-[10px] text-muted">
        {props.count} {props.count === 1 ? "nota" : "notas"}
        <span className="truncate pl-3">Tus ideas, en un solo lugar.</span>
      </footer>
    </section>
  );
}
