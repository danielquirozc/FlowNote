"use client";
import * as React from "react";
import { DropdownMenu as Primitive } from "radix-ui";
import { cn } from "@/lib/utils";
export const DropdownMenu = Primitive.Root;
export const DropdownMenuTrigger = Primitive.Trigger;
export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-44 rounded-lg border border-border bg-white p-1 shadow-lg shadow-black/5",
          className,
        )}
        {...props}
      />
    </Primitive.Portal>
  );
}
export function DropdownMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-secondary outline-none focus:bg-hover focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-40 [&_svg]:size-3.5",
        className,
      )}
      {...props}
    />
  );
}
