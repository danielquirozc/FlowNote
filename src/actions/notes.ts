"use server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { validateDocument } from "@/lib/server/document";
import { getPrisma } from "@/lib/server/prisma";
import { noteInclude, serializeNote } from "@/lib/server/data";
import {
  idSchema,
  mutate,
  MutationError,
  requireNote,
  requireFolder,
  requireTag,
  transaction,
} from "@/lib/server/mutations";

const createSchema = z
  .object({
    folderId: idSchema.nullable().optional(),
    tagId: idSchema.optional(),
    favorite: z.boolean().optional(),
  })
  .strict();
export async function createNote(input: unknown) {
  return mutate("No se pudo crear la nota.", async (userId) => {
    const data = createSchema.parse(input);
    return transaction(async (tx) => {
      if (data.folderId) await requireFolder(tx, userId, data.folderId);
      if (data.tagId) await requireTag(tx, userId, data.tagId);
      return serializeNote(
        await tx.note.create({
          data: {
            userId,
            folderId: data.folderId,
            isFavorite: data.favorite ?? false,
            ...(data.tagId
              ? { tags: { create: { tagId: data.tagId, userId } } }
              : {}),
          },
          include: noteInclude,
        }),
      );
    });
  });
}
const updateSchema = z
  .object({
    id: idSchema,
    title: z.string().trim().min(1).max(240),
    content: z.unknown().transform(validateDocument),
  })
  .strict();
export async function saveNote(input: unknown) {
  return mutate("No se pudo guardar la nota.", async (userId) => {
    const { id, title, content } = updateSchema.parse(input);
    return serializeNote(
      await getPrisma().note.update({
        where: { id_userId: { id, userId }, deletedAt: null },
        data: { title, content },
        include: noteInclude,
      }),
    );
  });
}
const operationSchema = z
  .object({
    id: idSchema,
    operation: z.enum(["favorite", "archive", "trash", "restore", "unarchive"]),
  })
  .strict();
export async function changeNoteState(input: unknown) {
  return mutate("No se pudo actualizar la nota.", async (userId) => {
    const { id, operation } = operationSchema.parse(input);
    return transaction(async (tx) => {
      const note = await requireNote(tx, userId, id);
      if (note.deletedAt && operation !== "restore")
        throw new MutationError("Restaura la nota antes de modificarla.");
      const data =
        operation === "favorite"
          ? { isFavorite: !note.isFavorite }
          : operation === "archive"
            ? { isArchived: true }
            : operation === "unarchive"
              ? { isArchived: false }
              : operation === "trash"
                ? { deletedAt: new Date(), isPublic: false, shareToken: null }
                : { deletedAt: null };
      return serializeNote(
        await tx.note.update({
          where: { id_userId: { id, userId } },
          data,
          include: noteInclude,
        }),
      );
    });
  });
}
export async function permanentlyDeleteNote(input: unknown) {
  return mutate("No se pudo eliminar la nota.", async (userId) => {
    const id = idSchema.parse(input);
    const result = await getPrisma().note.deleteMany({
      where: { id, userId, deletedAt: { not: null } },
    });
    if (!result.count)
      throw new MutationError(
        "Solo puedes eliminar permanentemente las notas de la papelera.",
      );
    return id;
  });
}
const folderSchema = z
  .object({ id: idSchema, folderId: idSchema.nullable() })
  .strict();
export async function assignFolder(input: unknown) {
  return mutate("No se pudo mover la nota.", async (userId) => {
    const { id, folderId } = folderSchema.parse(input);
    return transaction(async (tx) => {
      const note = await requireNote(tx, userId, id);
      if (note.deletedAt)
        throw new MutationError("Restaura la nota antes de moverla.");
      if (folderId) await requireFolder(tx, userId, folderId);
      return serializeNote(
        await tx.note.update({
          where: { id_userId: { id, userId } },
          data: { folderId },
          include: noteInclude,
        }),
      );
    });
  });
}
const tagSchema = z
  .object({ id: idSchema, tagId: idSchema, assigned: z.boolean() })
  .strict();
export async function assignTag(input: unknown) {
  return mutate(
    "No se pudieron actualizar las etiquetas de la nota.",
    async (userId) => {
      const { id, tagId, assigned } = tagSchema.parse(input);
      return transaction(async (tx) => {
        const note = await requireNote(tx, userId, id);
        if (note.deletedAt)
          throw new MutationError(
            "Restaura la nota antes de cambiar sus etiquetas.",
          );
        await requireTag(tx, userId, tagId);
        if (assigned)
          await tx.noteTag.upsert({
            where: { noteId_tagId: { noteId: id, tagId } },
            create: { noteId: id, tagId, userId },
            update: {},
          });
        else
          await tx.noteTag.deleteMany({ where: { noteId: id, tagId, userId } });
        return serializeNote(
          await tx.note.update({
            where: { id_userId: { id, userId } },
            data: { updatedAt: new Date() },
            include: noteInclude,
          }),
        );
      });
    },
  );
}

const sharingSchema = z.object({ id: idSchema, enabled: z.boolean() }).strict();
export async function setNoteSharing(input: unknown) {
  return mutate("No se pudo actualizar el enlace público.", async (userId) => {
    const { id, enabled } = sharingSchema.parse(input);
    return transaction(async (tx) => {
      const note = await requireNote(tx, userId, id);
      if (note.deletedAt)
        throw new MutationError("Restaura la nota antes de compartirla.");
      return serializeNote(
        await tx.note.update({
          where: { id_userId: { id, userId }, deletedAt: null },
          data: {
            isPublic: enabled,
            shareToken: enabled
              ? (note.shareToken ?? randomBytes(32).toString("base64url"))
              : null,
          },
          include: noteInclude,
        }),
      );
    });
  });
}
