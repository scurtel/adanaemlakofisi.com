import { NextResponse } from "next/server";
import { createAdminSession, destroyAdminSession } from "@/lib/auth/session";
import { verifyAdminCredentials } from "@/lib/auth/credentials";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gerekli." }, { status: 400 });
    }

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json({ error: "Geçersiz giriş bilgileri." }, { status: 401 });
    }

    await createAdminSession(email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Giriş işlemi başarısız." }, { status: 500 });
  }
}

export async function DELETE() {
  await destroyAdminSession();
  return NextResponse.json({ success: true });
}
