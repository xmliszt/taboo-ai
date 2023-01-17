import Link from "next/link";
import { BsFillQuestionDiamondFill } from "react-icons/bs";
import { TbBrandNextjs } from "react-icons/tb";
import { SiOpenai } from "react-icons/si";
import { FiGithub } from "react-icons/fi";

export default function HomePage() {
  const title = "Taboo.AI";

  return (
    <main className="h-full w-full overflow-auto">
      <Link
        href="/rule"
        className="text-white dark:text-neon-red-light text-xl lg:text-3xl fixed z-40 top-5 right-5 hover:animate-pulse"
      >
        <BsFillQuestionDiamondFill />
      </Link>
      <section className="flex flex-col justify-center items-center h-full w-screen gap-16">
        <h1 className="text-center text-5xl lg:text-8xl drop-shadow-lg">
          {title}
        </h1>
        <Link
          href="/levels"
          className="border-4 border-white dark:border-neon-green text-lg bg-black dark:bg-neon-black text-white dark:text-neon-green hover:text-black hover:dark:text-neon-black hover:bg-white hover:dark:bg-neon-green hover:border-gray hover:dark:border-neon-blue transition-all rounded px-5 lg:text-5xl lg:px-10 lg:py-5 lg:rounded-lg drop-shadow-lg shadow-lg"
        >
          START
        </Link>
      </section>
      <footer className="w-full h-12 rounded-t-2xl dark:drop-shadow-[0_-10px_30px_rgba(0,0,0,1)] flex justify-center items-center bg-gray dark:bg-neon-gray fixed bottom-0 text-white dark:text-neon-white lg:text-white-faded lg:dark:text-neon-white text-center text-[10px] lg:text-lg">
        <article className="flex-grow px-2">
          Powered by{" "}
          <a
            href="https://beta.nextjs.org/docs/getting-started"
            target="__blank"
            className="underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors"
          >
            Next.JS <TbBrandNextjs className="inline" />
          </a>{" "}
          &{" "}
          <a
            href="https://openai.com/api/"
            target="__blank"
            className="underline text-white dark:text-neon-green lg:hover:text-white lg:hover:dark:text-neon-white transition-colors"
          >
            OpenAI API <SiOpenai className="inline" />
          </a>{" "}
          | Developed by{" "}
          <a
            href="https://xmliszt.github.io/"
            target="__blank"
            className="underline text-white dark:text-neon-blue lg:hover:text-white lg:hover:dark:text-neon-red transition-colors"
          >
            Li Yuxuan <FiGithub className="inline" />
          </a>
        </article>
      </footer>
    </main>
  );
}
