import BackButton from "../(components)/BackButton";
import path from "path";
import fs from "fs";
import ReactMarkdown from "react-markdown";

function fetchRule(): string | null {
  try {
    const filePath = path.join(process.cwd(), "app/rule/rule.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    var rules = JSON.parse(jsonData).content as string;
    return rules;
  } catch (err) {
    return null;
  }
}

export default function RulePage() {
  const rule = fetchRule();
  return (
    <>
      <BackButton />
      <h1 className="fixed w-full top-4 lg:top-6 text-center text-xl lg:text-3xl">
        How To Play Taboo.AI?
      </h1>
      <article className="w-full h-full pt-20 pb-16 px-12 bg-black dark:bg-neon-black flex justify-center items-center overflow-hidden">
        <ReactMarkdown className="w-full lg:w-[80%] h-[80%] bg-gray dark:bg-neon-gray dark:text-neon-white text-white p-6 rounded-xl drop-shadow-xl overflow-y-scroll">
          {rule ?? "Cannot load the rules. Please reload!"}
        </ReactMarkdown>
      </article>
    </>
  );
}
