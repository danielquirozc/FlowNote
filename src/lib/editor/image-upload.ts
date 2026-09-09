"use client";
import { generateReactHelpers } from "@uploadthing/react";
import type { ImageRouter } from "@/app/api/uploadthing/core";
import { isSafeImageUrl } from "./document";
const { uploadFiles } = generateReactHelpers<ImageRouter>();
export async function uploadEditorImage(
  noteId: string,
  file: File,
): Promise<string> {
  if (
    !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
      file.type,
    ) ||
    file.size > 4 * 1024 * 1024
  )
    throw new Error("Elige una imagen PNG, JPEG, WebP o GIF de menos de 4 MB.");
  const result = await uploadFiles("noteImage", {
    files: [file],
    input: { noteId },
  });
  const url = result[0]?.ufsUrl;
  if (!url || !isSafeImageUrl(url))
    throw new Error("No se pudo subir la imagen. Inténtalo de nuevo.");
  return url;
}
