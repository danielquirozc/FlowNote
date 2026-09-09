BEGIN;
ALTER TABLE "Note" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "shareToken" TEXT;
CREATE UNIQUE INDEX "Note_shareToken_key" ON "Note"("shareToken");
ALTER TABLE "Note" ALTER COLUMN "title" SET DEFAULT 'Sin título';
COMMIT;
