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
        className={`font-serif transition-all h-8 w-8 shadow-lg lg:w-12 lg:h-12 aspect-square rounded-full text-center flex items-center justify-center text-base lg:text-xl ease-in-out ${
          n < c
            ? "bg-green text-white"
            : n == c
            ? "bg-yellow border-white border-4 text-black"
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
        className={`w-auto flex-grow shadow-lg transition-colors ease-in-out rounded-full h-2 ${
          n < c ? "bg-green " : "bg-white"
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
    <section className="w-full flex flex-row justify-between items-center gap-2 pl-6 pr-16 overflow-x-scroll scrollbar-hide">
      {renderProgress()}
    </section>
  );
}
