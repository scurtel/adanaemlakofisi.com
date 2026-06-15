import { NextResponse } from "next/server";
import { getAdminSession } from "./session";

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 }), session: null };
  }
  return { error: null, session };
}
