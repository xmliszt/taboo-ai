import "./global.css";
import "./main.css";
import { Lobster } from "@next/font/google";

const lobserFont = Lobster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lobster",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={lobserFont.className}>
      <head />
      <body>{children}</body>
    </html>
  );
}
