"use server";
import { z } from "zod";
import { getPrisma } from "@/lib/server/prisma";
import {
  idSchema,
  nameSchema,
  mutate,
  requireFolder,
  transaction,
} from "@/lib/server/mutations";
const select = { id: true, name: true } as const;
export async function createFolder(input: unknown) {
  return mutate(
    "No se pudo crear la carpeta. Elige un nombre único.",
    async (userId) =>
      getPrisma().folder.create({
        data: { name: nameSchema.parse(input), userId },
        select,
      }),
  );
}
export async function renameFolder(input: unknown) {
  return mutate(
    "No se pudo actualizar la carpeta. Elige un nombre único.",
    async (userId) => {
      const { id, name } = z
        .object({ id: idSchema, name: nameSchema })
        .strict()
        .parse(input);
      return getPrisma().folder.update({
        where: { id_userId: { id, userId } },
        data: { name },
        select,
      });
    },
  );
}
export async function deleteFolder(input: unknown) {
  return mutate("No se pudo eliminar la carpeta.", async (userId) => {
    const id = idSchema.parse(input);
    return transaction(async (tx) => {
      await requireFolder(tx, userId, id);
      await tx.note.updateMany({
        where: { userId, folderId: id },
        data: { folderId: null },
      });
      await tx.folder.delete({ where: { id_userId: { id, userId } } });
      return id;
    });
  });
}
