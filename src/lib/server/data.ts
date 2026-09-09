import {
  normalizeTiptapDocument,
  getPlainTextFromTiptapDocument,
} from "@/lib/editor/document";
import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { Note, WorkspaceData } from "@/types";
import { getPrisma } from "./prisma";
import { requireUser } from "./session";

export const noteInclude = {
  tags: { select: { tagId: true } },
} satisfies Prisma.NoteInclude;
export function serializeNote(
  note: Prisma.NoteGetPayload<{ include: typeof noteInclude }>,
): Note {
  const content = normalizeTiptapDocument(note.content);
  return {
    id: note.id,
    title: note.title,
    content,
    preview: getPlainTextFromTiptapDocument(content)
      .replace(/\s+/g, " ")
      .slice(0, 180),
    updatedAt: note.updatedAt.toISOString(),
    folderId: note.folderId,
    favorite: note.isFavorite,
    isPublic: note.isPublic,
    shareToken: note.shareToken,
    status: note.deletedAt
      ? "deleted"
      : note.isArchived
        ? "archived"
        : "active",
    tags: note.tags.map((tag) => tag.tagId),
  };
}
export async function getUserNotes() {
  const user = await requireUser();
  return (
    await getPrisma().note.findMany({
      where: { userId: user.id },
      include: noteInclude,
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    })
  ).map(serializeNote);
}
export async function getUserFolders() {
  const user = await requireUser();
  return getPrisma().folder.findMany({
    where: { userId: user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
export async function getUserTags() {
  const user = await requireUser();
  return getPrisma().tag.findMany({
    where: { userId: user.id },
    select: { id: true, name: true, color: true },
    orderBy: { name: "asc" },
  });
}
export async function getWorkspace(): Promise<WorkspaceData> {
  const user = await requireUser();
  const [notes, folders, tags] = await Promise.all([
    getUserNotes(),
    getUserFolders(),
    getUserTags(),
  ]);
  return {
    uploadsEnabled: Boolean(process.env.UPLOADTHING_TOKEN),
    notes,
    folders,
    tags,
    user: {
      name: user.name,
      initials: user.name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      workspace: "Espacio personal",
    },
  };
}
