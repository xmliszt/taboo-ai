"use client";

import "./global.css";
import "./main.css";
import { Lancelot, Orbitron, Special_Elite } from "@next/font/google";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { MdDarkMode, MdOutlineWbTwilight } from "react-icons/md";

const lancelot = Lancelot({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lancelot",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

const orbitron = Orbitron({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-orbitron",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const pathName = usePathname();

  return (
    <html
      className={`${isDark && "dark"} ${
        isDark ? orbitron.className : specialElite.className
      } font-serif`}
    >
      <head />
      <body className="bg-black dark:bg-neon-black dark:text-neon-white text-white">
        <button
          className={`fixed z-50 ${
            pathName === "/"
              ? "top-5 left-5"
              : (pathName?.match(/^\/level\/\d*/)?.length ?? 0 > 0) ||
                pathName === "/result"
              ? "top-4 lg:top-3.5 left-12 lg:left-20"
              : pathName === "/levels"
              ? "top-4 right-5 lg:top-3.5"
              : "bottom-5 left-5"
          } opacity-100 hover:animate-pulse transition-all text-2xl lg:text-5xl ${
            isDark && "text-neon-blue"
          }`}
          onClick={() => {
            setIsDark((dark) => (dark ? false : true));
          }}
        >
          {isDark ? <MdDarkMode /> : <MdOutlineWbTwilight />}
        </button>
        {children}
      </body>
    </html>
  );
}
