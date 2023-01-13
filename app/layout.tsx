import "./global.css";
import "./main.css";
import { Caveat } from "@next/font/google";

const caveatFont = Caveat({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-caveat",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={caveatFont.className}>
      <head />
      <body>{children}</body>
    </html>
  );
}
