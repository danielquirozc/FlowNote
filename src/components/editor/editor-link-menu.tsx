import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Modal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isSafeLink } from "@/lib/editor/document";
export function EditorLinkMenu({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const [range] = useState(() => ({
    from: editor.state.selection.from,
    to: editor.state.selection.to,
  }));
  const [url, setUrl] = useState<string>(
    () => editor.getAttributes("link").href ?? "",
  );
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [linked] = useState(() => editor.isActive("link"));
  return (
    <Modal
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={linked ? "Editar enlace" : "Añadir enlace"}
      description="Conecta esta idea con una página o dirección de correo."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const href = url.trim();
          if (!isSafeLink(href)) {
            setError("Usa un enlace completo con https://, http:// o mailto:.");
            return;
          }
          const chain = editor.chain().focus().setTextSelection(range);
          if (range.from === range.to && !linked)
            chain
              .insertContent({
                type: "text",
                text: text.trim() || href,
                marks: [{ type: "link", attrs: { href } }],
              })
              .run();
          else chain.extendMarkRange("link").setLink({ href }).run();
          onClose();
        }}
      >
        <label htmlFor="link-url" className="text-xs font-medium">
          URL
        </label>
        <input
          autoFocus
          id="link-url"
          value={url}
          maxLength={2048}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com"
          className="auth-input"
        />
        {range.from === range.to && !linked && (
          <>
            <label
              htmlFor="link-text"
              className="mt-4 block text-xs font-medium"
            >
              Texto visible (opcional)
            </label>
            <input
              id="link-text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="auth-input"
            />
          </>
        )}
        {error && (
          <p role="alert" className="mt-3 text-xs text-red-600">
            {error}
          </p>
        )}
        <div className="mt-5 flex justify-between gap-3">
          {linked && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .setTextSelection(range)
                  .extendMarkRange("link")
                  .unsetLink()
                  .run();
                onClose();
              }}
            >
              Quitar enlace
            </Button>
          )}
          <Button type="submit" className="ml-auto">
            Guardar enlace
          </Button>
        </div>
      </form>
    </Modal>
  );
}
