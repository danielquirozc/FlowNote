import { z } from "zod";

export type TiptapMark = {
  type: string;
  attrs?: Record<string, string | number | boolean | null>;
};
export type TiptapNode = {
  type: string;
  text?: string;
  attrs?: Record<string, string | number | boolean | null>;
  marks?: TiptapMark[];
  content?: TiptapNode[];
};
export type TiptapDocument = { type: "doc"; content: TiptapNode[] };
const attributes = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean(), z.null()]),
);
const nodeSchema: z.ZodType<TiptapNode> = z.lazy(() =>
  z
    .object({
      type: z.string(),
      text: z.string().optional(),
      attrs: attributes.optional(),
      marks: z
        .array(z.object({ type: z.string(), attrs: attributes.optional() }))
        .optional(),
      content: z.array(nodeSchema).optional(),
    })
    .strict(),
);
export const documentSchema = z
  .object({ type: z.literal("doc"), content: z.array(nodeSchema).min(1) })
  .strict();

export function plainTextToDocument(text: string): TiptapDocument {
  return {
    type: "doc",
    content: text.split(/\r\n|\r|\n/).map((line) => ({
      type: "paragraph",
      ...(line ? { content: [{ type: "text", text: line }] } : {}),
    })),
  };
}
export function normalizeTiptapDocument(content: unknown): TiptapDocument {
  if (typeof content === "string") return plainTextToDocument(content);
  // Unsupported stored data must surface an error, never silently become an empty note.
  return documentSchema.parse(content);
}
export function getPlainTextFromTiptapDocument(
  content: TiptapDocument,
): string {
  function text(node: TiptapNode): string {
    if (node.type === "text") return node.text ?? "";
    if (node.type === "hardBreak") return "\n";
    const value = node.content?.map(text).join("") ?? "";
    return ["paragraph", "heading", "codeBlock"].includes(node.type)
      ? `${value}\n`
      : value;
  }
  return content.content.map(text).join("").trim();
}
export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
export function isSafeLink(url: string): boolean {
  try {
    return (
      ["https:", "http:", "mailto:"].includes(new URL(url).protocol) &&
      !/[\u0000-\u0020]/.test(url)
    );
  } catch {
    return false;
  }
}
export function isSafeImageUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "https:" && !/[\u0000-\u0020]/.test(url);
  } catch {
    return false;
  }
}
