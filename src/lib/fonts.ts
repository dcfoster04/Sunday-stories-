import { Archivo, Source_Serif_4, Inter } from "next/font/google";

// Display: hero headlines, tickers, stat numbers, wordmark
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--ff-display",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

// Editorial serif: pull quotes, story excerpts, bylines
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--ff-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// UI sans: body copy, forms, dashboard
export const inter = Inter({
  subsets: ["latin"],
  variable: "--ff-sans",
  display: "swap",
});
