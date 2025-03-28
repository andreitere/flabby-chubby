import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import config from "../config";
import * as schema from "./schema";
const client = postgres(config.env.DATABASE_URL, {
  ssl: {
    rejectUnauthorized: false,
  },
  prepare: false,
});
const db = drizzle(client, { schema });

export default db;
