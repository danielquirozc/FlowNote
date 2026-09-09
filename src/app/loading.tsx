import { CollectionsSkeleton } from "@/components/sidebar/collections-skeleton";
import { NotesLoadingSkeleton } from "@/components/notes/notes-states";
export default function Loading() {
  return (
    <main
      aria-label="Cargando espacio personal"
      className="flex h-dvh overflow-hidden"
    >
      <aside className="hidden w-56 shrink-0 bg-surface p-3 lg:block">
        <div
          aria-hidden="true"
          className="mx-3 mb-6 mt-4 h-6 w-28 rounded bg-border/50"
        />
        <div aria-hidden="true" className="mx-3 h-10 rounded-lg bg-border/40" />
        <CollectionsSkeleton label="Cargando navegación" />
        <CollectionsSkeleton label="Cargando etiquetas" />
        <CollectionsSkeleton label="Cargando carpetas" />
      </aside>
      <section className="w-full shrink-0 border-r border-soft p-4 md:w-[320px] xl:w-[344px]">
        <div aria-hidden="true" className="mb-10 h-9 rounded-md bg-surface" />
        <NotesLoadingSkeleton />
      </section>
      <div aria-hidden="true" className="hidden min-w-0 flex-1 p-12 md:block">
        <div className="mx-auto max-w-[700px] space-y-6 motion-safe:animate-pulse">
          <div className="h-8 w-3/4 rounded bg-surface" />
          <div className="h-3 w-full rounded bg-surface" />
          <div className="h-3 w-5/6 rounded bg-surface" />
        </div>
      </div>
    </main>
  );
}
