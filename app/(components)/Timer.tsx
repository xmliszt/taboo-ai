'use client';

interface TimerProps {
  time: number;
}

export default function Timer(props: TimerProps) {
  return (
    <div
      id='timer'
      className={`shadow-lg min-w-[5rem] lg:min-w-[10rem] border-gray dark:border-neon-gray border-2 lg:border-4 rounded-tl-2xl rounded-br-2xl ${
        props.time > 100
          ? 'bg-red  text-white'
          : props.time > 50
          ? 'bg-yellow text-black'
          : 'bg-white text-red'
      } flex items-center justify-center text-base transition-colors ease-in-out lg:text-2xl px-2 py-1 lg:px-5 lg:py-2`}
    >
      <span>
        {props.time}
        <span className='text-base lg:text-2xl'>s</span>
      </span>
    </div>
  );
}
