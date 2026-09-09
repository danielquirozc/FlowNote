import type { Tag } from "@/types";
export function TagBadge({ tag }: { tag: Tag }) {
  return <span className={`tag-badge tag-${tag.color}`}>{tag.name}</span>;
}
