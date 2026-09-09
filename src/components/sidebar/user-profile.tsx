import { ChevronsUpDown, Check, LogOut } from "lucide-react";
import type { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function UserProfile({
  user,
  onSignOut,
}: {
  user: User;
  onSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-hover">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eae6df] text-[11px] font-semibold text-[#716657]">
            {user.initials}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">{user.name}</span>
            <span className="mt-0.5 block text-[10px] text-secondary">
              {user.workspace}
            </span>
          </span>
          <ChevronsUpDown size={13} className="text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>
          <Check />
          Espacio personal
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSignOut}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
        <p className="px-3 py-2 text-[11px] text-muted">
          Tu espacio personal para las ideas.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
