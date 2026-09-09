import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import { isSafeImageUrl, isSafeLink } from "./document";

const SafeImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        parseHTML: (element) => {
          const src = element.getAttribute("src") ?? "";
          return isSafeImageUrl(src) ? src : null;
        },
        renderHTML: (attributes) =>
          typeof attributes.src === "string" && isSafeImageUrl(attributes.src)
            ? { src: attributes.src }
            : {},
      },
    };
  },
});
export function createDocumentExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      underline: false,
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        isAllowedUri: (url) => isSafeLink(url),
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      },
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
      a11y: {
        checkboxLabel: (node, checked) =>
          `${checked ? "Tarea completada" : "Tarea pendiente"}: ${node.textContent || "Sin texto"}`,
      },
    }),
    SafeImage.configure({
      allowBase64: false,
      HTMLAttributes: { loading: "lazy", referrerpolicy: "no-referrer" },
    }),
  ];
}
