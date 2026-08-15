import type { Metadata } from "next";
import { archivo, sourceSerif, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sunday Stories — Your league has a story. We cover it.",
    template: "%s — Sunday Stories",
  },
  description:
    "Sunday Stories turns your fantasy football league's scores, history, rivalries, predictions and questionable decisions into personalized sports coverage your group chat will actually want to read.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
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
