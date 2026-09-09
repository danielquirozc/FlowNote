"use client";
import { Button } from "@/components/ui/button";
export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-xl font-semibold">No se pudo cargar FlowNote</h1>
      <p className="max-w-sm text-sm leading-6 text-secondary">
        Inténtalo de nuevo en un momento. Tus notas guardadas siguen intactas.
      </p>
      <Button onClick={reset}>Reintentar</Button>
      <a href="/sign-in" className="text-xs text-secondary hover:text-primary">
        Volver al inicio de sesión
      </a>
    </main>
  );
}
