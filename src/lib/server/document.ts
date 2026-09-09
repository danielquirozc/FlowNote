import "server-only";
import { getSchema } from "@tiptap/core";
import { createDocumentExtensions } from "@/lib/editor/extensions";
import {
  documentSchema,
  isSafeImageUrl,
  isSafeLink,
  type TiptapDocument,
} from "@/lib/editor/document";
import { MutationError } from "./mutations";
const schema = getSchema(createDocumentExtensions());

export function validateDocument(input: unknown): TiptapDocument {
  // Bound traversal before recursive schema parsing; request bodies also have Next's size limit.
  const stack: { value: unknown; depth: number }[] = [
    { value: input, depth: 0 },
  ];
  let nodes = 0;
  while (stack.length) {
    const item = stack.pop()!;
    if (++nodes > 20000 || item.depth > 40)
      throw new MutationError(
        "El documento es demasiado grande o tiene demasiados niveles.",
      );
    if (item.value && typeof item.value === "object")
      for (const value of Object.values(item.value))
        stack.push({ value, depth: item.depth + 1 });
  }
  if (new TextEncoder().encode(JSON.stringify(input)).length > 800000)
    throw new MutationError("La nota es demasiado grande para guardarla.");
  const doc = documentSchema.parse(input);
  const visit = [...doc.content];
  while (visit.length) {
    const node = visit.pop()!;
    if (
      node.type === "image" &&
      (typeof node.attrs?.src !== "string" || !isSafeImageUrl(node.attrs.src))
    )
      throw new MutationError(
        "Las imágenes deben usar una URL HTTPS. No se admiten imágenes incrustadas.",
      );
    if (
      node.type === "heading" &&
      ![1, 2, 3].includes(Number(node.attrs?.level))
    )
      throw new MutationError("Nivel de encabezado no compatible.");
    for (const mark of node.marks ?? []) {
      if (mark.type === "link") {
        if (
          typeof mark.attrs?.href !== "string" ||
          !isSafeLink(mark.attrs.href)
        )
          throw new MutationError(
            "Introduce un enlace HTTP, HTTPS o de correo válido.",
          );
        mark.attrs = {
          href: mark.attrs.href,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
          class: null,
        };
      }
    }
    visit.push(...(node.content ?? []));
  }
  try {
    schema.nodeFromJSON(doc).check();
  } catch {
    throw new MutationError("La nota contiene un formato no compatible.");
  }
  return doc;
}
