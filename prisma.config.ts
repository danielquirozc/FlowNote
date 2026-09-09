import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Generation and offline migration diffs do not require a database URL.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
