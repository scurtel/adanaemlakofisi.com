import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getProductionDatabaseUrl } from "./db-url.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, label) {
  console.log(`\n[hostinger-build] ${label}...`);
  execSync(cmd, { stdio: "inherit", cwd: root, env: process.env });
}

process.env.DATABASE_URL = getProductionDatabaseUrl(root);
console.log(`[hostinger-build] DATABASE_URL → ${process.env.DATABASE_URL}`);

const steps = [
  { cmd: "node scripts/set-db-target.mjs sqlite", label: "SQLite hedefi ayarlanıyor" },
  { cmd: "npx prisma generate", label: "Prisma client üretiliyor" },
  { cmd: "npx prisma migrate deploy", label: "Prisma migration uygulanıyor" },
  { cmd: "npx prisma db seed", label: "Veritabanı seed ediliyor" },
  { cmd: "npm run build:next", label: "Next.js build başlıyor" },
];

for (const step of steps) {
  try {
    run(step.cmd, step.label);
  } catch (err) {
    console.error(`\n[hostinger-build] HATA: "${step.label}" adımında build durdu.`);
    console.error(err.message ?? err);
    process.exit(1);
  }
}

console.log("\n[hostinger-build] Build tamamlandı.");
