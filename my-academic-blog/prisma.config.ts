import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
    // Si tu proveedor te dio SHADOW_DATABASE_URL, puedes agregarlo después:
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
