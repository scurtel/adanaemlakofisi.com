import { hashPassword } from "../lib/auth/password";

const password = process.argv[2];

if (!password) {
  console.error("Kullanım: npm run admin:hash-password -- <sifre>");
  console.error("Örnek: npm run admin:hash-password -- GucluSifrem123");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Şifre en az 8 karakter olmalıdır.");
  process.exit(1);
}

const hash = hashPassword(password);
console.log("\nAşağıdaki değeri .env dosyanıza ekleyin:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
