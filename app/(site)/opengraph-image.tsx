import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/constants";

export const alt = SITE_CONFIG.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          background: "linear-gradient(135deg, #0f2744 0%, #1a4a7a 50%, #c9a227 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.9, marginBottom: 16 }}>Adana</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>
          {SITE_CONFIG.name}
        </div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.92, maxWidth: 800 }}>
          Satılık ve kiralık konut, arsa ve iş yeri ilanları
        </div>
      </div>
    ),
    { ...size }
  );
}
