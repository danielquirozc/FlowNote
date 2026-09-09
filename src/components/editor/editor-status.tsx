import { FileText, RotateCcw } from "lucide-react";
import type { SaveStatus } from "@/hooks/use-note-autosave";
export function EditorStatus({
  words,
  status,
  error,
  onRetry,
}: {
  words: number;
  status: SaveStatus;
  error: string;
  onRetry: () => void;
}) {
  return (
    <footer className="flex min-h-9 shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-soft px-5 py-2 text-[10px] leading-4 text-secondary">
      <span className="flex items-center gap-1.5 tabular-nums">
        <FileText size={12} />
        {words} {words === 1 ? "palabra" : "palabras"}
        <span className="hidden sm:contents">
          <span className="mx-1">·</span>Nota personal
        </span>
      </span>
      <span
        role="status"
        title={error || undefined}
        className="flex items-center gap-2"
      >
        <span
          className={`size-1.5 rounded-full ${status === "error" ? "bg-red-400" : status === "saved" ? "bg-[#a5b8a4]" : "bg-indigo-300"}`}
        />
        {
          {
            saved: "Guardado",
            saving: "Guardando…",
            unsaved: "Sin guardar",
            error: "Error al guardar",
          }[status]
        }
        {status === "error" && (
          <button
            type="button"
            aria-label="Reintentar guardado"
            title={error}
            onClick={onRetry}
            className="flex items-center gap-1 rounded px-1 text-primary hover:bg-primary-soft"
          >
            <RotateCcw size={11} />
            Reintentar
          </button>
        )}
      </span>
      {status === "error" && (
        <p className="w-full text-[11px] text-red-600">{error}</p>
      )}
    </footer>
  );
}
