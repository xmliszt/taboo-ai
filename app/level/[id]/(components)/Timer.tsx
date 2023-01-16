"use client";

interface TimerProps {
  time: number;
}

export default function Timer(props: TimerProps) {
  return (
    <div
      id="timer"
      className={`shadow-lg min-w-[5rem] lg:min-w-[10rem] border-gray dark:border-neon-gray border-2 lg:border-4 rounded-full bg-white dark:bg-neon-black text-red dark:text-neon-red text-center flex items-center justify-center text-base lg:text-2xl px-2 py-1 lg:px-5 lg:py-3`}
    >
      <span>
        {props.time}
        <span className="text-base lg:text-2xl">s</span>
      </span>
    </div>
  );
}
