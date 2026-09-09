import { PublicShell } from "@/components/sharing/public-shell";
export default function Loading() {
  return (
    <PublicShell>
      <div
        role="status"
        aria-label="Cargando nota compartida"
        className="space-y-6 motion-safe:animate-pulse"
      >
        <div className="h-9 w-3/4 rounded bg-surface" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-3 rounded bg-surface" />
        ))}
      </div>
    </PublicShell>
  );
}
