"use client";

import { useEffect } from "react";
import BackButton from "./(components)/BackButton";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-10">
      <BackButton href="/" />
      <h1 className="text-3xl lg:text-5xl text-white text-center">
        Something went wrong!
      </h1>
      <button
        id="reset"
        className="text-2xl lg:text-4xl text-red hover:text-white transition-all"
        onClick={() => reset()}
      >
        Reset
      </button>
    </div>
  );
}
