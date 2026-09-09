import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function SidebarNavItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex min-h-9 w-full items-center gap-3 rounded-lg px-3 py-2 text-[12px] leading-4 transition-colors",
        active
          ? "bg-primary-soft font-medium text-primary"
          : "text-secondary hover:bg-hover hover:text-foreground",
      )}
    >
      <Icon size={16} strokeWidth={1.7} className="shrink-0" />
      <span className="min-w-0 flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "shrink-0 text-[11px] tabular-nums",
            active ? "text-primary/80" : "text-muted",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
