import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getProductionDatabaseUrl } from "./db-url.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

process.env.DATABASE_URL = getProductionDatabaseUrl(root);
process.env.NODE_ENV = process.env.NODE_ENV || "production";

function run(cmd, label) {
  console.log(`[hostinger-start] ${label}...`);
  execSync(cmd, { stdio: "inherit", cwd: root, env: process.env });
}

console.log(`[hostinger-start] DATABASE_URL → ${process.env.DATABASE_URL}`);

try {
  run("node scripts/set-db-target.mjs sqlite", "SQLite hedefi");
  run("npx prisma migrate deploy", "Migration");
  run("npx prisma db seed", "Seed");
} catch (err) {
  console.error("[hostinger-start] DB hazırlığı başarısız:", err.message ?? err);
  process.exit(1);
}

const port = process.env.PORT || "3000";
console.log(`[hostinger-start] Next.js başlatılıyor (0.0.0.0:${port})...`);
execSync(`npx next start -H 0.0.0.0 -p ${port}`, {
  stdio: "inherit",
  cwd: root,
  env: process.env,
});
