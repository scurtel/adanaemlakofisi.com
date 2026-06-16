import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, label) {
  console.log(`\n[hostinger-build] ${label}...`);
  execSync(cmd, { stdio: "inherit", cwd: root, env: process.env });
}

// DATABASE_URL tanımlı değilse production.db kullan
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./prisma/production.db";
  console.log(`[hostinger-build] DATABASE_URL tanımlı değil → ${process.env.DATABASE_URL}`);
}

const steps = [
  { cmd: "node scripts/set-db-target.mjs sqlite", label: "SQLite hedefi ayarlanıyor" },
  { cmd: "npx prisma generate",                   label: "Prisma client üretiliyor" },
  { cmd: "npx prisma migrate deploy",             label: "Prisma migration uygulanıyor" },
  { cmd: "npm run build:next",                    label: "Next.js build başlıyor" },
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

// Seed: hata verirse build'i kırma, sadece uyar
try {
  console.log("\n[hostinger-build] Seed çalıştırılıyor (hata verirse atlanır)...");
  execSync("npx tsx prisma/seed.ts", {
    stdio: "inherit",
    cwd: root,
    env: process.env,
  });
  console.log("[hostinger-build] Seed tamamlandı.");
} catch (err) {
  console.warn("[hostinger-build] Seed başarısız, atlandı:", err.message ?? err);
}

console.log("\n[hostinger-build] Build tamamlandı.");
