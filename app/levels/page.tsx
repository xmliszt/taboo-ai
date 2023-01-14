"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cacheLevel, clearCache } from "../(caching)/cache";
import BackButton from "../(components)/BackButton";
import Loading from "../(components)/Loading";
import { getLevels } from "../(services)/levelService";
import ILevel from "./(models)/level.interface";

export default function LevelsPage() {
  const title = "Choose A Category";
  const router = useRouter();
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLevels = async () => {
    setIsLoading(true);
    const levels = await getLevels();
    setIsLoading(false);
    setLevels(levels);
  };

  const goToLevel = (levelID: string) => {
    cacheLevel(levels.filter((level) => level.id === levelID)[0]);
    router.push(`/level/${levelID}`);
  };

  useEffect(() => {
    fetchLevels();
    clearCache();
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} message="Fetching Levels..." />
      <section className="pt-5 lg:pt-10">
        <BackButton href="/" />
        <h1 className="text-center drop-shadow-lg text-2xl lg:text-6xl">
          {title}
        </h1>
        <section className="flex flex-col gap-4 lg:gap-6 p-6 fixed w-screen h-screen top-0 left-0 justify-center items-center">
          {levels.map((level) => (
            <button
              key={level.id}
              className="drop-shadow-lg shadow-lg w-full border-2 lg:border-8 border-white text-lg bg-black text-white hover:text-black hover:bg-white hover:border-gray transition-all rounded px-5 lg:text-5xl lg:px-10 lg:py-5 lg:rounded-lg"
              onClick={() => goToLevel(level.id)}
            >
              {level.name}
            </button>
          ))}
          <Link
            key="ai-mode"
            id="ai-mode"
            className="drop-shadow-lg shadow-lg w-full unicorn-color text-center border-2 lg:border-8 border-white text-lg bg-black text-white hover:text-black hover:bg-white hover:border-gray transition-all rounded px-5 lg:text-5xl lg:px-10 lg:py-5 lg:rounded-lg"
            href={`/ai`}
          >
            AI Mode
          </Link>
        </section>
      </section>
    </>
  );
}
