import type { Editor } from "@tiptap/core";
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  Minus,
  ImagePlus,
  type LucideIcon,
} from "lucide-react";
export interface EditorCommand {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  run: (editor: Editor) => void;
}
export function getEditorCommands(onImage: () => void): EditorCommand[] {
  return [
    {
      id: "text",
      label: "Texto",
      detail: "Un párrafo sencillo",
      icon: Text,
      run: (e) => {
        e.chain().focus().clearNodes().setParagraph().run();
      },
    },
    ...([1, 2, 3] as const).map((level) => ({
      id: `heading${level}`,
      label: `Encabezado ${level}`,
      detail: ["Encabezado grande", "Encabezado mediano", "Encabezado pequeño"][
        level - 1
      ],
      icon: [Heading1, Heading2, Heading3][level - 1],
      run: (e: Editor) => {
        e.chain().focus().clearNodes().setHeading({ level }).run();
      },
    })),
    {
      id: "bulletList",
      label: "Lista con viñetas",
      detail: "Una lista sin orden",
      icon: List,
      run: (e) => {
        e.chain().focus().toggleBulletList().run();
      },
    },
    {
      id: "orderedList",
      label: "Lista numerada",
      detail: "Una lista ordenada",
      icon: ListOrdered,
      run: (e) => {
        e.chain().focus().toggleOrderedList().run();
      },
    },
    {
      id: "taskList",
      label: "Lista de tareas",
      detail: "Organiza tus tareas",
      icon: ListChecks,
      run: (e) => {
        e.chain().focus().toggleTaskList().run();
      },
    },
    {
      id: "blockquote",
      label: "Cita",
      detail: "Una idea para destacar",
      icon: Quote,
      run: (e) => {
        e.chain().focus().toggleBlockquote().run();
      },
    },
    {
      id: "codeBlock",
      label: "Bloque de código",
      detail: "Código con fuente monoespaciada",
      icon: Code2,
      run: (e) => {
        e.chain().focus().toggleCodeBlock().run();
      },
    },
    {
      id: "horizontalRule",
      label: "Separador",
      detail: "Una separación entre secciones",
      icon: Minus,
      run: (e) => {
        e.chain().focus().setHorizontalRule().run();
      },
    },
    {
      id: "image",
      label: "Imagen",
      detail: "Sube una imagen o añade su URL",
      icon: ImagePlus,
      run: onImage,
    },
  ];
}
