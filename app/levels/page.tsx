import ILevel from "./level.interface";
import Link from "next/link";

export default function LevelsPage() {
  const levels: ILevel[] = [
    {
      id: 1,
      name: "Food",
      difficulty: 1,
    },
    {
      id: 2,
      name: "Country",
      difficulty: 2,
    },
    {
      id: 3,
      name: "Programming Language",
      difficulty: 3,
    },
  ];

  const title = "Choose A Category";

  return (
    <>
      <h1 className="text-center text-2xl mt-5 lg:mt-10 lg:text-6xl">
        {title}
      </h1>
      <section className="flex flex-col gap-4 p-6 fixed w-screen h-screen top-0 left-0 justify-center items-center">
        {levels.map((level) => (
          <Link
            key={level.id}
            className="w-2/5 border border-white p-4 text-center rounded-lg hover:bg-white hover:text-slate-600 text-2xl"
            href={`/level/${level.id}`}
          >
            {level.name}
          </Link>
        ))}
      </section>
    </>
  );
}
