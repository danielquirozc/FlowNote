import { Archive, Files, Settings2, Star, Trash2, X } from "lucide-react";
import { SidebarNavItem } from "@/components/sidebar/sidebar-nav-item";
import { UserProfile } from "@/components/sidebar/user-profile";
import { TagsSection } from "@/components/sidebar/tags-section";
import { FoldersSection } from "@/components/sidebar/folders-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Folder, Note, NoteFilter, Tag, User } from "@/types";
interface Props {
  user: User;
  notes: Note[];
  tags: Tag[];
  folders: Folder[];
  filter: NoteFilter;
  onFilter: (filter: NoteFilter) => void;
  onSettings: () => void;
  onAddTag: () => void;
  onAddFolder: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onEditTag: (tag: Tag) => void;
  onDeleteTag: (tag: Tag) => void;
  onSignOut: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}
export function AppSidebar({
  user,
  notes,
  tags,
  folders,
  filter,
  onFilter,
  onSettings,
  onAddTag,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  onEditTag,
  onDeleteTag,
  onSignOut,
  mobileOpen,
  onClose,
}: Props) {
  const nav = [
    { kind: "all", label: "Todas las notas", icon: Files },
    { kind: "favorites", label: "Favoritos", icon: Star },
    { kind: "archived", label: "Archivadas", icon: Archive },
    { kind: "deleted", label: "Eliminadas recientemente", icon: Trash2 },
  ] as const;
  return (
    <>
      <button
        hidden={!mobileOpen}
        aria-label="Cerrar navegación"
        className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden"
        onClick={onClose}
      />
      <aside
        className={cn(
          "app-sidebar flex h-dvh w-[224px] shrink-0 flex-col bg-surface px-4 pb-4 pt-5",
          mobileOpen
            ? "fixed inset-y-0 left-0 z-40 !flex shadow-xl lg:static lg:shadow-none"
            : "hidden lg:flex",
        )}
      >
        <div className="mb-4 flex items-center gap-2.5 px-3">
          <span className="flow-logo" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="text-[21px] font-semibold tracking-[-0.8px]">
            FlowNote<span className="text-primary">.</span>
          </span>
          <Button
            className="ml-auto lg:hidden"
            variant="ghost"
            size="icon"
            aria-label="Cerrar navegación"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>
        <UserProfile user={user} onSignOut={onSignOut} />
        <div className="sidebar-scroll mt-4 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <nav aria-label="Navegación principal" className="space-y-0.5">
            {nav.map((item) => (
              <SidebarNavItem
                key={item.kind}
                icon={item.icon}
                label={item.label}
                count={
                  item.kind === "all"
                    ? notes.filter((n) => n.status === "active").length
                    : item.kind === "favorites"
                      ? notes.filter(
                          (n) => n.status !== "deleted" && n.favorite,
                        ).length
                      : notes.filter(
                          (n) =>
                            n.status ===
                            (item.kind === "deleted" ? "deleted" : "archived"),
                        ).length
                }
                active={filter.kind === item.kind}
                onClick={() => onFilter({ kind: item.kind })}
              />
            ))}
          </nav>
          <TagsSection
            tags={tags}
            filter={filter}
            onFilter={onFilter}
            onAdd={onAddTag}
            onEdit={onEditTag}
            onDelete={onDeleteTag}
          />
          <FoldersSection
            folders={folders}
            filter={filter}
            onFilter={onFilter}
            onAdd={onAddFolder}
            onEdit={onEditFolder}
            onDelete={onDeleteFolder}
          />
        </div>
        <div className="shrink-0 pt-3">
          <SidebarNavItem
            icon={Settings2}
            label="Configuración"
            active={false}
            onClick={onSettings}
          />
          <div className="mt-2 flex items-center gap-2 px-3 text-[10px] text-muted">
            <span className="size-1.5 rounded-full bg-[#a5b8a4]" />
            Un espacio para tus ideas.
          </div>
        </div>
      </aside>
    </>
  );
}
