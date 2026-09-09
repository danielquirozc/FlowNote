import { BubbleMenu } from "@tiptap/react/menus";
import { useEditorState, type Editor } from "@tiptap/react";
import { Bold, Italic, Strikethrough, Link } from "lucide-react";
import { FormatButton } from "./format-button";
export function EditorBubbleMenu({
  editor,
  onLink,
}: {
  editor: Editor;
  onLink: () => void;
}) {
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      link: e.isActive("link"),
    }),
  });
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ editor: e, state }) =>
        e.isEditable &&
        !state.selection.empty &&
        !e.isActive("image") &&
        !e.isActive("codeBlock")
      }
    >
      <div
        role="toolbar"
        aria-label="Formato de la selección"
        className="flex items-center gap-0.5 rounded-lg border border-soft bg-white p-1 shadow-sm"
      >
        <FormatButton
          icon={Bold}
          label="Negrita"
          active={active.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <FormatButton
          icon={Italic}
          label="Cursiva"
          active={active.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <FormatButton
          icon={Strikethrough}
          label="Tachado"
          active={active.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <FormatButton
          icon={Link}
          label="Enlace"
          active={active.link}
          onClick={onLink}
        />
      </div>
    </BubbleMenu>
  );
}
