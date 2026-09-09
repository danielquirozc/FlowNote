"use client";
import { PublicShell } from "@/components/sharing/public-shell";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <PublicShell>
      <div role="alert" className="py-12 text-center">
        <h1 className="text-xl font-semibold">No se pudo cargar la nota.</h1>
        <p className="mb-6 mt-3 text-sm text-secondary">
          Comprueba tu conexión e inténtalo de nuevo.
        </p>
        <Button variant="outline" onClick={reset}>
          Reintentar
        </Button>
      </div>
    </PublicShell>
  );
}
