import { verifyPassword } from "./password";

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !passwordHash) return false;
  if (email !== adminEmail) return false;

  return verifyPassword(password, passwordHash);
}
