export interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;
  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

export async function uploadToCloudinary(
  file: File,
  folder = "adanaemlakofisi/listings"
): Promise<string> {
  const config = getCloudinaryConfig();
  if (!config) throw new Error("Cloudinary ayarları eksik.");

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  const timestamp = Math.round(Date.now() / 1000);
  const folderParam = folder;
  const paramsToSign = `folder=${folderParam}&timestamp=${timestamp}`;
  const crypto = await import("crypto");
  const signature = crypto
    .createHash("sha1")
    .update(paramsToSign + config.apiSecret)
    .digest("hex");

  const formData = new FormData();
  formData.append("file", base64);
  formData.append("api_key", config.apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = (await res.json()) as { secure_url?: string; error?: { message: string } };
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Görsel yüklenemedi.");
  }

  return data.secure_url;
}
