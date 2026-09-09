import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/server/prisma";
import { normalizeTiptapDocument } from "@/lib/editor/document";
import { PublicDocument } from "@/components/sharing/public-document";
import { PublicShell } from "@/components/sharing/public-shell";
// Always check revocation against the database; never prerender or cache shared documents.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Nota compartida · FlowNote",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};
export default async function SharedNote({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  const note = await getPrisma().note.findFirst({
    where: { shareToken: token, isPublic: true, deletedAt: null },
    select: { title: true, content: true },
  });
  if (!note) notFound();
  return (
    <PublicShell>
      <article>
        <p className="mb-3 text-xs text-muted">
          Nota compartida · Solo lectura
        </p>
        <h1 className="mb-9 break-words text-3xl font-semibold tracking-tight sm:text-4xl">
          {note.title}
        </h1>
        <PublicDocument content={normalizeTiptapDocument(note.content)} />
      </article>
    </PublicShell>
  );
}
