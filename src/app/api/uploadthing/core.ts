import "server-only";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { getAuth } from "@/lib/auth";
import { getPrisma } from "@/lib/server/prisma";
const upload = createUploadthing();
export const imageRouter = {
  noteImage: upload({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .input(z.object({ noteId: z.string().uuid() }).strict())
    .middleware(async ({ req, input, files }) => {
      const session = await getAuth().api.getSession({ headers: req.headers });
      if (!session)
        throw new UploadThingError("Inicia sesión para subir imágenes.");
      if (
        !(await getPrisma().note.findFirst({
          where: { id: input.noteId, userId: session.user.id, deletedAt: null },
          select: { id: true },
        }))
      )
        throw new UploadThingError("Esta nota no está disponible.");
      if (
        files.some(
          (file) =>
            !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
              file.type,
            ),
        )
      )
        throw new UploadThingError("Elige una imagen PNG, JPEG, WebP o GIF.");
      return { userId: session.user.id, noteId: input.noteId };
    })
    .onUploadComplete(async ({ file }) => ({ url: file.ufsUrl })),
} satisfies FileRouter;
export type ImageRouter = typeof imageRouter;
