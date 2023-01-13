"use client";

import { useEffect } from "react";
import { useTimer } from "use-timer";

export default function Timer() {
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });

  useEffect(() => {
    start();

    return () => {
      reset();
    };
  }, [reset, start]);

  return (
    <div className="fixed top-3 right-3 aspect-square border-red-500 border-4 rounded-full bg-white text-red-400 text-center w-16 flex items-center justify-center text-3xl font-mono">
      <span>
        {time}
        <span className="text-base">s</span>
      </span>
    </div>
  );
}
