"use client";
import { useEffect, useRef, useState } from "react";
export interface Confirmation {
  title: string;
  description: string;
  action: string;
}
export function useConfirmation() {
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const resolve = useRef<((value: boolean) => void) | null>(null);
  useEffect(
    () => () => {
      resolve.current?.(false);
    },
    [],
  );
  function confirm(value: Confirmation) {
    resolve.current?.(false);
    setConfirmation(value);
    return new Promise<boolean>((done) => {
      resolve.current = done;
    });
  }
  function respond(value: boolean) {
    resolve.current?.(value);
    resolve.current = null;
    setConfirmation(null);
  }
  return { confirmation, confirm, respond };
}
