import "server-only";
import { z } from "zod";
import { getCurrentUser } from "./session";
import { getPrisma } from "./prisma";
import type { ActionResult } from "@/types";
import type { Prisma } from "@/generated/prisma/client";

export const idSchema = z.string().uuid();
export const nameSchema = z.string().trim().min(1).max(64);
export class MutationError extends Error {}
export async function mutate<T>(
  message: string,
  operation: (userId: string) => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const user = await getCurrentUser();
    if (!user)
      return {
        success: false,
        error: "Tu sesión ha caducado. Inicia sesión de nuevo para continuar.",
      };
    return { success: true, data: await operation(user.id) };
  } catch (error) {
    if (error instanceof z.ZodError)
      return {
        success: false,
        error: "Revisa los datos e inténtalo de nuevo.",
      };
    if (error instanceof MutationError)
      return { success: false, error: error.message };
    return { success: false, error: message };
  }
}
export async function requireNote(
  tx: Prisma.TransactionClient,
  userId: string,
  id: string,
) {
  const note = await tx.note.findUnique({
    where: { id_userId: { id, userId } },
  });
  if (!note) throw new MutationError("Esta nota ya no está disponible.");
  return note;
}
export async function requireFolder(
  tx: Prisma.TransactionClient,
  userId: string,
  id: string,
) {
  if (!(await tx.folder.findUnique({ where: { id_userId: { id, userId } } })))
    throw new MutationError("Esta carpeta ya no está disponible.");
}
export async function requireTag(
  tx: Prisma.TransactionClient,
  userId: string,
  id: string,
) {
  if (!(await tx.tag.findUnique({ where: { id_userId: { id, userId } } })))
    throw new MutationError("Esta etiqueta ya no está disponible.");
}
export function transaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return getPrisma().$transaction(operation);
}
