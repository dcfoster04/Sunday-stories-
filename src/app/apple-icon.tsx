import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08080a",
        }}
      >
        <div
          style={{
            fontSize: 104,
            fontWeight: 900,
            color: "#eab84c",
            fontFamily: "sans-serif",
          }}
        >
          S
        </div>
      </div>
    ),
    { ...size },
  );
}
