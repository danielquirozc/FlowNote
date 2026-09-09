"use client";
import { Check, Clock3, PencilLine } from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "./editor-toolbar";
import { FormattingToolbar } from "./formatting-toolbar";
import { EditorBubbleMenu } from "./editor-bubble-menu";
import { EditorLinkMenu } from "./editor-link-menu";
import { EditorImage } from "./editor-image";
import { EditorStatus } from "./editor-status";
import { TagBadge } from "@/components/notes/tag-badge";
import { noteDate } from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { createDocumentExtensions } from "@/lib/editor/extensions";
import { createSlashCommands } from "@/lib/editor/slash-commands";
import {
  countWords,
  normalizeTiptapDocument,
  type TiptapDocument,
} from "@/lib/editor/document";
import { useNoteAutosave, type EditorHandle } from "@/hooks/use-note-autosave";
import type { ActionResult, Note } from "@/types";
interface Props extends ComponentProps<typeof EditorToolbar> {
  editing: boolean;
  frozen: boolean;
  uploadsEnabled: boolean;
  onEdit: () => void;
  onFinish: () => Promise<void>;
  onSave: (
    title: string,
    content: TiptapDocument,
  ) => Promise<ActionResult<Note>>;
}
export const NoteEditor = forwardRef<EditorHandle, Props>(
  function NoteEditor(props, ref) {
    const {
      note,
      tags,
      editing,
      frozen,
      onEdit,
      onFinish,
      onSave,
      uploadsEnabled,
    } = props;
    const [title, setTitle] = useState(note.title);
    const titleRef = useRef(note.title);
    const editorRef = useRef<Editor | null>(null);
    const [menu, setMenu] = useState<"link" | "image" | null>(null);
    const autosave = useNoteAutosave(
      () => ({
        title: titleRef.current,
        content: editorRef.current
          ? normalizeTiptapDocument(editorRef.current.getJSON())
          : note.content,
      }),
      (snapshot) => onSave(snapshot.title, snapshot.content),
    );
    const [extensions] = useState(() => [
      ...createDocumentExtensions(),
      Placeholder.configure({
        placeholder: "Empieza a escribir… o escribe “/” para ver los comandos",
        showOnlyWhenEditable: false,
      }),
      createSlashCommands(() => setMenu("image")),
    ]);
    const editor = useEditor({
      extensions,
      content: note.content,
      editable: editing && !frozen,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editorProps: {
        attributes: {
          class: "note-content flownote-prose",
          "aria-label": "Contenido de la nota",
        },
        handlePaste: (_view, event) => {
          if (!editorRef.current?.isEditable) return false;
          if (event.clipboardData?.files.length) {
            event.preventDefault();
            setMenu("image");
            return true;
          }
          return false;
        },
        handleDrop: (_view, event) => {
          if (!editorRef.current?.isEditable) return false;
          if (event.dataTransfer?.files.length) {
            event.preventDefault();
            setMenu("image");
            return true;
          }
          return false;
        },
      },
      onUpdate: () => autosave.changed(),
    });
    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);
    useEffect(() => {
      editor?.setEditable(editing && !frozen, false);
    }, [editor, editing, frozen]);
    useImperativeHandle(ref, () => ({ flush: autosave.flush }), [
      autosave.flush,
    ]);
    const bodyWords =
      useEditorState({
        editor,
        selector: ({ editor: current }) =>
          current ? countWords(current.getText({ blockSeparator: "\n" })) : 0,
      }) ?? 0;
    const words = countWords(title) + bodyWords;
    return (
      <section
        aria-label="Editor de notas"
        className="flex h-dvh min-w-0 flex-1 flex-col bg-white"
      >
        <EditorToolbar {...props} />
        <div className="editor-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <article className="editor-document mx-auto max-w-[800px] px-6 pb-16 pt-7 lg:px-10 xl:px-12">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((id) => {
                  const tag = tags.find((t) => t.id === id);
                  return tag && <TagBadge key={id} tag={tag} />;
                })}
              </div>
              {note.status !== "deleted" && (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={frozen || !editor}
                  aria-pressed={editing}
                  className="shrink-0 gap-2 text-xs aria-pressed:bg-primary-soft aria-pressed:text-primary"
                  onClick={() => {
                    if (editing) void onFinish();
                    else onEdit();
                  }}
                >
                  {editing ? <Check /> : <PencilLine />}
                  {editing ? "Terminar edición" : "Editar nota"}
                </Button>
              )}
            </div>
            {editing ? (
              <input
                aria-label="Título de la nota"
                placeholder="Sin título"
                maxLength={240}
                value={title}
                disabled={frozen}
                onChange={(event) => {
                  titleRef.current = event.target.value;
                  setTitle(event.target.value);
                  autosave.changed();
                }}
                className="note-title w-full rounded border-0 bg-transparent text-[32px] font-semibold leading-[1.2] tracking-[-1.25px] xl:text-[38px]"
              />
            ) : (
              <h1 className="note-title text-[32px] font-semibold leading-[1.2] tracking-[-1.25px] xl:text-[38px]">
                {title.trim() || "Sin título"}
              </h1>
            )}
            <div className="mb-7 mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <Clock3 size={12} />
                Editado {noteDate(note.updatedAt)}
              </span>
              <span>·</span>
              <span>{Math.max(1, Math.ceil(words / 220))} min de lectura</span>
            </div>
            {editor && editing && (
              <FormattingToolbar
                editor={editor}
                onLink={() => setMenu("link")}
                onImage={() => setMenu("image")}
              />
            )}
            <EditorContent editor={editor} className="min-h-[35vh]" />
            {editor && editing && !menu && !frozen && (
              <EditorBubbleMenu
                editor={editor}
                onLink={() => setMenu("link")}
              />
            )}
            {!editor && (
              <div
                role="status"
                className="min-h-[35vh] space-y-3 text-xs text-muted"
              >
                <span className="sr-only">Cargando editor…</span>
                <div className="h-3 w-full rounded bg-surface" />
                <div className="h-3 w-4/5 rounded bg-surface" />
              </div>
            )}
            <div className="mt-10 flex items-center gap-2 text-[10px] text-muted">
              <span className="h-px w-8 bg-border" />
              Una idea que vale la pena guardar.
            </div>
          </article>
        </div>
        <EditorStatus
          words={words}
          status={autosave.status}
          error={autosave.error}
          onRetry={() => {
            void autosave.flush();
          }}
        />
        {editor && menu === "link" && (
          <EditorLinkMenu editor={editor} onClose={() => setMenu(null)} />
        )}
        {editor && menu === "image" && (
          <EditorImage
            editor={editor}
            noteId={note.id}
            uploadsEnabled={uploadsEnabled}
            onClose={() => setMenu(null)}
          />
        )}
      </section>
    );
  },
);
