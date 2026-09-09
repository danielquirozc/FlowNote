import { useState } from "react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/notes/tag-badge";
import { tagColors, type Folder, type Tag, type TagColor } from "@/types";
const colorLabels: Record<TagColor, string> = {
  indigo: "Índigo",
  sage: "Salvia",
  amber: "Ámbar",
  rose: "Rosa",
  slate: "Pizarra",
};
export type DialogState =
  | { kind: "settings" | "comments" }
  | { kind: "share"; noteId: string }
  | { kind: "folder"; folder?: Folder }
  | { kind: "tag"; tag?: Tag };
interface Props {
  dialog: DialogState | null;
  onClose: () => void;
  onSave: (name: string, color: TagColor) => Promise<boolean>;
  pending: boolean;
}
export function WorkspaceDialogs({ dialog, onClose, onSave, pending }: Props) {
  const existing =
    dialog?.kind === "tag"
      ? dialog.tag
      : dialog?.kind === "folder"
        ? dialog.folder
        : undefined;
  const [value, setValue] = useState(existing?.name ?? "");
  const [color, setColor] = useState<TagColor>(
    dialog?.kind === "tag" ? (dialog.tag?.color ?? "slate") : "slate",
  );
  const kind = dialog?.kind;
  const title =
    kind === "folder" || kind === "tag"
      ? `${existing ? "Renombrar" : "Crear"} ${kind === "folder" ? "carpeta" : "etiqueta"}`
      : kind === "settings"
        ? "Configuración"
        : kind === "share"
          ? "Compartir nota"
          : "Comentarios";
  return (
    <Modal
      open={!!dialog}
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
      title={title}
      description={
        kind === "share"
          ? "Elige quién puede leer esta nota."
          : kind === "comments"
            ? "Los comentarios aún no están disponibles."
            : "Un espacio sencillo para concentrarte."
      }
    >
      {kind === "settings" && (
        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Apariencia</span>
            <span>Claro</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Espacio</span>
            <span>Personal</span>
          </div>
          <p className="rounded-md bg-surface p-3 text-xs leading-5 text-secondary">
            Tus notas son privadas hasta que decidas compartirlas. Los cambios
            se guardan automáticamente mientras escribes.
          </p>
        </div>
      )}
      {(kind === "folder" || kind === "tag") && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (value.trim() && (await onSave(value.trim(), color))) onClose();
          }}
        >
          <label htmlFor="collection-name" className="text-xs font-medium">
            Nombre
          </label>
          <input
            id="collection-name"
            autoFocus
            required
            maxLength={64}
            value={value}
            disabled={pending}
            onChange={(event) => setValue(event.target.value)}
            className="auth-input"
          />
          {kind === "tag" && (
            <fieldset disabled={pending} className="mt-4">
              <legend className="mb-2 text-xs font-medium">Color</legend>
              <div className="flex flex-wrap gap-2">
                {tagColors.map((key) => (
                  <button
                    type="button"
                    key={key}
                    aria-label={colorLabels[key]}
                    aria-pressed={color === key}
                    onClick={() => setColor(key)}
                    className="rounded-md p-1 ring-offset-2 aria-pressed:ring-1 aria-pressed:ring-primary"
                  >
                    <TagBadge
                      tag={{
                        id: key,
                        name: colorLabels[key],
                        color: key,
                      }}
                    />
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <Button
            disabled={pending || !value.trim()}
            type="submit"
            className="mt-5 w-full"
          >
            {pending
              ? "Guardando…"
              : existing
                ? "Guardar cambios"
                : `Crear ${kind === "folder" ? "carpeta" : "etiqueta"}`}
          </Button>
        </form>
      )}
    </Modal>
  );
}
