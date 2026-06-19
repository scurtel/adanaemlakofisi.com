import { join } from "path";

/** Hostinger (Linux) için mutlak, Windows için göreli SQLite URL */
export function getProductionDatabaseUrl(root) {
  if (process.platform === "win32") {
    return "file:./prisma/production.db";
  }
  return `file:${join(root, "prisma", "production.db")}`;
}
