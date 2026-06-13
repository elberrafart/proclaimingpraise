import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Proclaiming Praise — Advancing the Kingdom of Heaven";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0f",
          fontFamily: "serif",
        }}
      >
        {/* Gold cross mark */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#d4af37",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2v20M2 8h20"
              stroke="#0f0f0f"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-1px",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Proclaiming Praise
        </div>

        <div
          style={{
            fontSize: 26,
            color: "#d4af37",
            letterSpacing: "4px",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Advancing the Kingdom of Heaven
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "1px",
          }}
        >
          proclaimingpraise.org
        </div>
      </div>
    ),
    { ...size }
  );
}
