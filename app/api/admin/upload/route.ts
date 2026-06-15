import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/guard";
import { uploadToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  const { error } = await requireAdminSession();
  if (error) return error;

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary ayarları eksik. .env dosyasını kontrol edin." },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Yalnızca JPEG, PNG ve WebP dosyaları kabul edilir." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Dosya boyutu 5 MB'ı aşamaz." },
        { status: 400 }
      );
    }

    const url = await uploadToCloudinary(file);
    return NextResponse.json({ url });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Yükleme başarısız." },
      { status: 500 }
    );
  }
}
