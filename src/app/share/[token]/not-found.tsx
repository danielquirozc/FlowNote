import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { PublicShell } from "@/components/sharing/public-shell";
export default function UnavailableNote() {
  return (
    <PublicShell>
      <div className="py-12 text-center">
        <FileQuestion className="mx-auto mb-5 size-8 text-muted" />
        <h1 className="text-xl font-semibold">La nota no está disponible</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-secondary">
          Es posible que el enlace haya expirado o que el propietario haya
          dejado de compartirla.
        </p>
        <Link
          className="mt-6 inline-block rounded-lg px-3 py-2 text-sm text-primary hover:bg-primary-soft"
          href="/"
        >
          Volver a FlowNote
        </Link>
      </div>
    </PublicShell>
  );
}
