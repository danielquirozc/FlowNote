import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Link,
  Undo2,
  Redo2,
} from "lucide-react";
import { FormatButton } from "./format-button";
import { getEditorCommands } from "@/lib/editor/commands";
export function FormattingToolbar({
  editor,
  onLink,
  onImage,
}: {
  editor: Editor;
  onLink: () => void;
  onImage: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      strike: e.isActive("strike"),
      code: e.isActive("code"),
      link: e.isActive("link"),
      block: [1, 2, 3].find((level) => e.isActive("heading", { level })) ?? 0,
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      taskList: e.isActive("taskList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      undo: e.can().undo(),
      redo: e.can().redo(),
    }),
  });
  const commands = getEditorCommands(onImage);
  return (
    <div
      role="toolbar"
      aria-label="Formato del texto"
      className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface p-1.5"
    >
      <label className="flex items-center">
        <span className="sr-only">Estilo de texto</span>
        <select
          value={state.block}
          onChange={(event) => commands[Number(event.target.value)].run(editor)}
          className="h-8 max-w-28 rounded-lg bg-transparent px-2 text-xs text-secondary outline-offset-2"
        >
          <option value={0}>Párrafo</option>
          <option value={1}>Encabezado 1</option>
          <option value={2}>Encabezado 2</option>
          <option value={3}>Encabezado 3</option>
        </select>
      </label>
      <div className="flex gap-0.5">
        <FormatButton
          icon={Bold}
          label="Negrita"
          active={state.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <FormatButton
          icon={Italic}
          label="Cursiva"
          active={state.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <FormatButton
          icon={Strikethrough}
          label="Tachado"
          active={state.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <FormatButton
          icon={Code}
          label="Código en línea"
          active={state.code}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      </div>
      <div className="flex flex-wrap gap-0.5">
        {commands.slice(4).map((command) => (
          <FormatButton
            key={command.id}
            icon={command.icon}
            label={command.label}
            active={
              command.id in state
                ? Boolean(state[command.id as keyof typeof state])
                : false
            }
            onClick={() => command.run(editor)}
          />
        ))}
        <FormatButton
          icon={Link}
          label="Editar enlace"
          active={state.link}
          onClick={onLink}
        />
      </div>
      <div className="flex gap-0.5">
        <FormatButton
          icon={Undo2}
          label="Deshacer"
          disabled={!state.undo}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <FormatButton
          icon={Redo2}
          label="Rehacer"
          disabled={!state.redo}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>
    </div>
  );
}
