import { config } from "dotenv";
config({ path: ".env" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const passwordHash = await bcrypt.hash("password123", 12);

  const [user] = await db
    .insert(users)
    .values({
      name: "Test User",
      email: "test@homebase.dev",
      passwordHash,
    })
    .onConflictDoNothing()
    .returning();

  if (user) {
    console.log(`Created test user: ${user.email}`);
  } else {
    console.log("Test user already exists.");
  }

  console.log("\nLogin credentials:");
  console.log("  Email:    test@homebase.dev");
  console.log("  Password: password123");
}

seed().catch(console.error);
