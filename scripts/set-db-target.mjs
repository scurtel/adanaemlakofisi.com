import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const target = process.argv[2];

if (target !== "sqlite" && target !== "postgres") {
  console.error("Kullanım: node scripts/set-db-target.js <sqlite|postgres>");
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const prismaDir = join(root, "prisma");
const migrationsDir = join(prismaDir, "migrations");
const sourceMigrations = join(prismaDir, `migrations-${target}`);
const schemaSource = join(prismaDir, `schema.${target === "postgres" ? "postgresql" : "sqlite"}.prisma`);

if (!existsSync(schemaSource)) {
  console.error(`Şema dosyası bulunamadı: ${schemaSource}`);
  process.exit(1);
}

if (!existsSync(sourceMigrations)) {
  console.error(`Migration klasörü bulunamadı: ${sourceMigrations}`);
  process.exit(1);
}

cpSync(schemaSource, join(prismaDir, "schema.prisma"));
writeFileSync(
  join(migrationsDir, "migration_lock.toml"),
  `provider = "${target === "postgres" ? "postgresql" : "sqlite"}"\n`
);

if (existsSync(migrationsDir)) {
  for (const entry of readdirSync(migrationsDir)) {
    if (entry === "migration_lock.toml") continue;
    rmSync(join(migrationsDir, entry), { recursive: true, force: true });
  }
} else {
  mkdirSync(migrationsDir, { recursive: true });
}

for (const entry of readdirSync(sourceMigrations)) {
  cpSync(join(sourceMigrations, entry), join(migrationsDir, entry), { recursive: true });
}

console.log(`Veritabanı hedefi ayarlandı: ${target}`);
