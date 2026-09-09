"use client";
import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { createDocumentExtensions } from "@/lib/editor/extensions";
import type { TiptapDocument } from "@/lib/editor/document";
export function PublicDocument({ content }: { content: TiptapDocument }) {
  const [extensions] = useState(createDocumentExtensions);
  const editor = useEditor({
    extensions,
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "note-content flownote-prose",
        "aria-label": "Contenido de la nota",
      },
    },
  });
  if (!editor)
    return (
      <div
        role="status"
        aria-label="Cargando nota"
        className="space-y-4 motion-safe:animate-pulse"
      >
        <div className="h-3 rounded bg-surface" />
        <div className="h-3 w-4/5 rounded bg-surface" />
      </div>
    );
  return <EditorContent editor={editor} />;
}
