"use client";

import { uniqueId } from "lodash";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar(props: ProgressBarProps) {
  const makeProgressNode = (n: number, c: number) => {
    return (
      <span
        key={uniqueId(n.toString())}
        className={`transition-colors w-8 shadow-lg lg:w-16 aspect-square rounded-full text-center flex items-center justify-center text-base lg:text-4xl ease-in-out ${
          n < c
            ? "bg-green text-white"
            : n == c
            ? "bg-yellow border-white animate-spin border-4 text-black"
            : "bg-white text-black"
        }`}
      >
        {n}
      </span>
    );
  };

  const makeLinkage = (n: number, c: number) => {
    return (
      <div
        key={uniqueId(n.toString())}
        className={`w-auto flex-grow  shadow-lg transition-colors ease-in-out rounded-full h-2 lg:h-3 ${
          n < c ? "bg-green" : "bg-white"
        }`}
      ></div>
    );
  };

  const renderProgress = () => {
    let current = props.current;
    let total = props.total;

    var parts = [];
    for (var i = 1; i <= total; i++) {
      parts.push(makeProgressNode(i, current));
      i < total && parts.push(makeLinkage(i, current));
    }
    return parts;
  };

  return (
    <section className="w-full flex flex-row justify-between items-center gap-5 pl-6 pr-16">
      {renderProgress()}
    </section>
  );
}
