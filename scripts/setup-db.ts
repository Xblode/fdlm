import { config } from "dotenv";
import { readFileSync } from "fs";
import path from "path";
import { Client } from "pg";

config({ path: ".env.local" });

async function setupDb() {
  const connectionString = (
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.POSTGRES_URL
  )?.replace(/[?&]sslmode=[^&]*/g, "");

  if (!connectionString) {
    throw new Error("POSTGRES_URL_NON_POOLING or POSTGRES_URL is required.");
  }

  const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
  const schema = readFileSync(schemaPath, "utf-8");

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  await client.query(schema);
  await client.end();

  console.log("Database schema applied.");
}

setupDb().catch((error) => {
  console.error("Database setup failed:", error);
  process.exit(1);
});
