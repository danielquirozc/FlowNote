import Link from "next/link";
import type { ReactNode } from "react";
export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh max-w-[848px] px-6 py-8 sm:px-12 sm:py-12">
      <header className="mb-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary"
        >
          <span className="flow-logo scale-75" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          FlowNote<span className="text-primary">.</span>
        </Link>
      </header>
      {children}
    </main>
  );
}
