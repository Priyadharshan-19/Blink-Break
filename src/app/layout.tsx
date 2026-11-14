import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Caveat } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "BlinkBreak — Take Breaks. Take Care.",
  description:
    "Your friendly anime eye-care companion that reminds you to take regular breaks, follow the 20-20-20 rule, and build healthier screen habits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased selection:bg-[#7C6FF6]/20 selection:text-[#7C6FF6]">
        {children}
      </body>
    </html>
  );
}