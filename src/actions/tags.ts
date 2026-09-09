"use server";
import { z } from "zod";
import { getPrisma } from "@/lib/server/prisma";
import { tagColors } from "@/types";
import { idSchema, nameSchema, mutate } from "@/lib/server/mutations";
const select = { id: true, name: true, color: true } as const;
const tagInput = z
  .object({ name: nameSchema, color: z.enum(tagColors) })
  .strict();
export async function createTag(input: unknown) {
  return mutate(
    "No se pudo crear la etiqueta. Elige un nombre único.",
    async (userId) =>
      getPrisma().tag.create({
        data: { ...tagInput.parse(input), userId },
        select,
      }),
  );
}
export async function renameTag(input: unknown) {
  return mutate(
    "No se pudo actualizar la etiqueta. Elige un nombre único.",
    async (userId) => {
      const { id, ...data } = tagInput.extend({ id: idSchema }).parse(input);
      return getPrisma().tag.update({
        where: { id_userId: { id, userId } },
        data,
        select,
      });
    },
  );
}
export async function deleteTag(input: unknown) {
  return mutate("No se pudo eliminar la etiqueta.", async (userId) => {
    const id = idSchema.parse(input);
    await getPrisma().tag.delete({ where: { id_userId: { id, userId } } });
    return id;
  });
}
