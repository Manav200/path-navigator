import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Serif, Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import DemoPresetBar from "@/components/testing/DemoPresetBar";
import FeedbackWidget from "@/components/testing/FeedbackWidget";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PathNavigate — Alexandria Curated Career Discovery & Experiential Skill Trees",
  description:
    "An authoritative, scholarly digital curator for Indian career discovery and 7-day experiential skill roadmaps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${inter.variable} ${publicSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-[#fef3c7] selection:text-[#453b00]">
        <AuthProvider>
          <Suspense fallback={null}>
            <DemoPresetBar />
          </Suspense>
          <div className="flex-1 flex flex-col">{children}</div>
          <FeedbackWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
