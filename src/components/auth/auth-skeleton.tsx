export function AuthSkeleton() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-6">
      <div
        role="status"
        aria-label="Cargando formulario"
        className="w-full max-w-sm space-y-6 rounded-xl bg-white p-7 motion-safe:animate-pulse"
      >
        <div className="h-6 w-3/4 rounded bg-hover" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 rounded-lg bg-surface" />
        ))}
      </div>
    </main>
  );
}
