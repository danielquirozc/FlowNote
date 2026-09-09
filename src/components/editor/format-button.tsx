import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
export function FormatButton({
  icon: Icon,
  label,
  active = false,
  onClick,
  disabled = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="size-8 shrink-0 rounded-lg text-secondary aria-pressed:bg-primary-soft aria-pressed:text-primary"
    >
      <Icon className="!size-3.5" />
    </Button>
  );
}
