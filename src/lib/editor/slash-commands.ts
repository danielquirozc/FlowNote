import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { exitSuggestion } from "@tiptap/suggestion";
import { PluginKey } from "@tiptap/pm/state";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";
import {
  SlashCommandMenu,
  type SlashMenuHandle,
  type SlashMenuProps,
} from "@/components/editor/slash-command-menu";
import { getEditorCommands, type EditorCommand } from "./commands";
const slashKey = new PluginKey("flowNoteSlash");
export function createSlashCommands(onImage: () => void) {
  return Extension.create({
    name: "slashCommands",
    addProseMirrorPlugins() {
      return [
        Suggestion<EditorCommand>({
          editor: this.editor,
          pluginKey: slashKey,
          char: "/",
          allowSpaces: false,
          allow: ({ state }) =>
            this.editor.isEditable &&
            state.selection.$from.parent.type.name === "paragraph",
          items: ({ query }) =>
            getEditorCommands(onImage).filter((item) =>
              `${item.label} ${item.detail}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            ),
          command: ({ editor, range, props }) => {
            editor.chain().focus().deleteRange(range).run();
            props.run(editor);
          },
          render: () => {
            let renderer: ReactRenderer<
              SlashMenuHandle,
              SlashMenuProps
            > | null = null;
            let cleanup: (() => void) | undefined;
            let rectangle: (() => DOMRect | null) | null | undefined;
            let disposed = false;
            const position = () => {
              const rect = rectangle?.();
              if (!rect || !renderer) return;
              const element = renderer.element as HTMLElement;
              void computePosition(
                { getBoundingClientRect: () => rect },
                element,
                {
                  strategy: "fixed",
                  placement: "bottom-start",
                  middleware: [offset(6), flip(), shift({ padding: 12 })],
                },
              ).then(({ x, y }) => {
                if (!disposed)
                  Object.assign(element.style, {
                    left: `${x}px`,
                    top: `${y}px`,
                  });
              });
            };
            return {
              onStart: (props) => {
                disposed = false;
                rectangle = props.clientRect;
                renderer = new ReactRenderer(SlashCommandMenu, {
                  props: {
                    items: props.items,
                    command: props.command,
                    query: props.query,
                  },
                  editor: props.editor,
                });
                Object.assign((renderer.element as HTMLElement).style, {
                  position: "fixed",
                  zIndex: "60",
                });
                document.body.appendChild(renderer.element);
                position();
                cleanup = autoUpdate(
                  {
                    getBoundingClientRect: () => rectangle?.() ?? new DOMRect(),
                    contextElement: props.editor.view.dom,
                  },
                  renderer.element as HTMLElement,
                  position,
                );
              },
              onUpdate: (props) => {
                rectangle = props.clientRect;
                renderer?.updateProps({
                  items: props.items,
                  command: props.command,
                  query: props.query,
                });
                position();
              },
              onKeyDown: (props) => {
                if (props.event.key === "Escape") {
                  props.event.preventDefault();
                  props.event.stopPropagation();
                  exitSuggestion(props.view, slashKey);
                  return true;
                }
                return renderer?.ref?.onKeyDown(props.event) ?? false;
              },
              onExit: () => {
                disposed = true;
                cleanup?.();
                renderer?.element.remove();
                renderer?.destroy();
                renderer = null;
              },
            };
          },
        }),
      ];
    },
  });
}
