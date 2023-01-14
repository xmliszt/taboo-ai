import "./global.css";
import "./main.css";
import { Lancelot } from "@next/font/google";

const lancelot = Lancelot({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lancelot",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${lancelot.className} bg-black text-white`}>
      <head />
      <body className="h-screen">{children}</body>
    </html>
  );
}
