import type { Metadata } from "next";
import { archivo, sourceSerif, inter } from "@/lib/fonts";
import "./globals.css";

// Resolution order: an explicitly configured site URL, then Vercel's
// auto-provided deployment hostname (no setup required, but has no
// protocol prefix), then localhost as the pure-local-dev fallback. Only
// affects metadata URL resolution (Open Graph/canonical) — actual
// invite/share links are built client-side from window.location.origin
// and are correct regardless of this value.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: {
    default: "Sunday Stories — Your league has a story. We cover it.",
    template: "%s — Sunday Stories",
  },
  description:
    "Sunday Stories turns your fantasy football league's scores, history, rivalries, predictions and questionable decisions into personalized sports coverage your group chat will actually want to read.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Sunday Stories",
    description: "Your fantasy league has a story. We cover it.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${sourceSerif.variable} ${inter.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
