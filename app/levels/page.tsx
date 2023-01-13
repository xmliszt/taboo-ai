import Link from "next/link";
import path from "path";
import fs from "fs";
import ILevel from "../../app/levels/(models)/level.interface";

function fetchLevels(): ILevel[] {
  const filePath = path.join(process.cwd(), "levels.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  var levels = JSON.parse(jsonData).levels as ILevel[];
  levels = levels.map((level, idx) => {
    return {
      ...level,
      difficulty: Number(level.difficulty),
      id: Number(idx),
    };
  });
  return levels;
}

export default function LevelsPage() {
  const title = "Choose A Category";
  const levels = fetchLevels();

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
