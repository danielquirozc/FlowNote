export function CollectionsSkeleton({ label }: { label: string }) {
  return (
    <section
      role="status"
      aria-label={label}
      className="mt-7 space-y-3 px-3 motion-safe:animate-pulse"
    >
      <div className="mb-4 h-2 w-20 rounded bg-border/60" />
      {[1, 2, 3].map((i) => (
        <div key={i} aria-hidden="true" className="flex h-5 items-center gap-3">
          <div className="size-3 rounded bg-border/60" />
          <div className="h-2 w-24 rounded bg-border/50" />
        </div>
      ))}
    </section>
  );
}
