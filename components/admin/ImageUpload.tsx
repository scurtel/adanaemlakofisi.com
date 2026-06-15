"use client";

import { useRef, useState } from "react";
import adminStyles from "./admin.module.css";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  cloudinaryConfigured: boolean;
}

export default function ImageUpload({
  images,
  onChange,
  cloudinaryConfigured,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    if (!cloudinaryConfigured) {
      setError("Cloudinary ayarları eksik. Görselleri URL olarak ekleyebilirsiniz.");
      return;
    }

    setUploading(true);
    setError("");
    const newUrls: string[] = [];

    try {
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Yükleme başarısız.");
        newUrls.push(data.url);
      }
      onChange([...images, ...newUrls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function moveCover(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div className={styles.wrap}>
      {!cloudinaryConfigured && (
        <div className={adminStyles.error} style={{ marginBottom: "0.75rem" }}>
          Cloudinary ayarları eksik. Görsel yüklemek için CLOUDINARY_* env değişkenlerini tanımlayın.
        </div>
      )}

      <div className={styles.toolbar}>
        <button
          type="button"
          className={adminStyles.geminiBtn}
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !cloudinaryConfigured}
        >
          {uploading ? "Yükleniyor..." : "Görsel Yükle"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        <span className={styles.hint}>JPEG, PNG, WebP — max 5 MB</span>
      </div>

      {error && <div className={adminStyles.error}>{error}</div>}

      {images.length > 0 && (
        <div className={styles.grid}>
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className={styles.card}>
              {i === 0 && <span className={styles.coverBadge}>Kapak</span>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Görsel ${i + 1}`} className={styles.preview} />
              <div className={styles.actions}>
                {i !== 0 && (
                  <button type="button" onClick={() => moveCover(i)} className={styles.actionBtn}>
                    Kapak Yap
                  </button>
                )}
                <button type="button" onClick={() => removeImage(i)} className={styles.removeBtn}>
                  Kaldır
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
