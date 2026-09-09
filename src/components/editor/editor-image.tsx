import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Upload } from "lucide-react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadEditorImage } from "@/lib/editor/image-upload";
import { isSafeImageUrl } from "@/lib/editor/document";
export function EditorImage({
  editor,
  noteId,
  uploadsEnabled,
  onClose,
}: {
  editor: Editor;
  noteId: string;
  uploadsEnabled: boolean;
  onClose: () => void;
}) {
  const [position] = useState(() => editor.state.selection.from);
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  function insert(url: string) {
    if (!isSafeImageUrl(url)) {
      setError("Introduce una URL de imagen HTTPS.");
      return;
    }
    if (!editor.isDestroyed)
      editor
        .chain()
        .focus()
        .setTextSelection(position)
        .setImage({ src: url, alt: alt.trim() })
        .run();
    onClose();
  }
  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
      title="Añadir imagen"
      description="Dale contexto visual a esta idea."
    >
      <label htmlFor="image-alt" className="text-xs font-medium">
        Descripción de la imagen
      </label>
      <input
        id="image-alt"
        className="auth-input"
        maxLength={500}
        value={alt}
        disabled={busy}
        onChange={(event) => setAlt(event.target.value)}
        placeholder="Describe la imagen para los lectores"
      />
      {uploadsEnabled ? (
        <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-surface px-3 py-5 text-xs text-secondary">
          <Upload size={16} />
          {busy ? "Subiendo…" : "Elegir imagen · hasta 4 MB"}
          <input
            type="file"
            className="sr-only"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={busy}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setError("");
              try {
                insert(await uploadEditorImage(noteId, file));
              } catch {
                setError(
                  "No se pudo subir la imagen. Elige un archivo PNG, JPEG, WebP o GIF de menos de 4 MB e inténtalo de nuevo.",
                );
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      ) : (
        <p className="mt-4 text-xs leading-5 text-secondary">
          La subida de imágenes no está disponible. Puedes añadir una imagen
          mediante su URL.
        </p>
      )}
      <form
        className="mt-5"
        onSubmit={(event) => {
          event.preventDefault();
          insert(src.trim());
        }}
      >
        <label htmlFor="image-url" className="text-xs font-medium">
          URL de la imagen
        </label>
        <input
          id="image-url"
          className="auth-input"
          placeholder="https://…"
          value={src}
          maxLength={4096}
          disabled={busy}
          onChange={(event) => setSrc(event.target.value)}
        />
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={busy || !src.trim()}
        >
          Insertar imagen
        </Button>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-xs leading-5 text-red-600">
          {error}
        </p>
      )}
    </Modal>
  );
}
