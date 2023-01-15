"use client";

import { VT323 } from "@next/font/google";
interface TimerProps {
  time: number;
}

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
});

export default function Timer(props: TimerProps) {
  return (
    <div
      id="timer"
      style={{ minWidth: "1.75rem" }}
      className={`fixed top-4 right-3 z-50 shadow-lg border-gray border-2 lg:border-4 rounded-full bg-white text-red text-center flex items-center justify-center text-base lg:text-5xl lg:px-5 lg:py-3 ${vt323.className}`}
    >
      <span>
        {props.time}
        <span className="text-base lg:text-2xl">s</span>
      </span>
    </div>
  );
}
