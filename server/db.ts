import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import path from "path";
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | undefined;
let db: ReturnType<typeof drizzle> | undefined;
let migrationPromise: Promise<void> | undefined;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  const migrationsFolder = path.resolve(process.cwd(), "migrations");
  migrationPromise = migrate(db, { migrationsFolder }).catch((err) => {
    console.error("Migration error:", err);
  });
} else {
  console.warn("DATABASE_URL not set. Falling back to in-memory storage.");
  migrationPromise = Promise.resolve();
}

export { pool, db, migrationPromise as dbReady };
