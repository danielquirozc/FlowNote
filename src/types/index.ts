import type { TiptapDocument } from "@/lib/editor/document";
export const tagColors = ["indigo", "sage", "amber", "rose", "slate"] as const;
export type TagColor = (typeof tagColors)[number];
export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}
export interface Folder {
  id: string;
  name: string;
}
export interface User {
  name: string;
  initials: string;
  workspace: string;
}
export interface Note {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  tags: string[];
  folderId: string | null;
  isPublic: boolean;
  shareToken: string | null;
  favorite: boolean;
  status: "active" | "archived" | "deleted";
  content: TiptapDocument;
}
export type NoteFilter =
  | { kind: "all" | "favorites" | "archived" | "deleted" }
  | { kind: "tag" | "folder"; id: string };
export interface WorkspaceData {
  uploadsEnabled: boolean;
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  user: User;
}
export type ActionResult<T> =
  { success: true; data: T } | { success: false; error: string };
