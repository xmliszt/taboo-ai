"use client";

import { useEffect } from "react";
import { useTimer } from "use-timer";
import { Status } from "use-timer/lib/types";

interface TimerProps {
  timeStatus: Status;
}

export default function Timer(props: TimerProps) {
  const { time, start, pause, reset, status } = useTimer({
    initialTime: 0,
    timerType: "INCREMENTAL",
  });

  useEffect(() => {
    console.log(`Timer: ${props.timeStatus}`);
    switch (props.timeStatus) {
      case "RUNNING":
        start();
        break;
      case "PAUSED":
        pause();
        break;
      case "STOPPED":
        reset();
        break;
    }
  }, [props.timeStatus, pause, reset, start]);

  return (
    <div className="fixed top-3 right-3 border-red-500 border-4 lg:border-8 rounded-full bg-white text-red-400 text-center flex items-center justify-center text-3xl lg:text-5xl font-mono px-3 py-1 lg:px-5 lg:py-3">
      <span>
        {time}
        <span className="text-base lg:text-2xl">s</span>
      </span>
    </div>
  );
}
