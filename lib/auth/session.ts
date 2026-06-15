import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  createSessionToken,
  SESSION_MAX_AGE,
  verifyToken,
} from "./token";

export async function createAdminSession(email: string): Promise<void> {
  const token = createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function verifySessionToken(token: string | undefined): boolean {
  return verifyToken(token) !== null;
}

export { COOKIE_NAME, verifyToken };
