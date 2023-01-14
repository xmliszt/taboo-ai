"use client";
interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  const makeProgressNode = (n: number, c: number) => {
    return (
      <span
        key={n}
        className={`transition-all w-16 aspect-square rounded-full text-center flex items-center justify-center text-2xl ${
          n <= c ? "bg-green-500 text-white" : "bg-white text-black"
        }`}
      >
        {n}
      </span>
    );
  };
  const renderProgress = () => {
    let current = props.current;
    let total = props.total;

    var parts = [];
    for (var i = 1; i <= total; i++) {
      parts.push(makeProgressNode(i, current));
    }
    return parts;
  };

  return (
    <section className="w-full flex flex-row justify-between bg-red pl-6 pr-16">
      {renderProgress()}
    </section>
  );
}
