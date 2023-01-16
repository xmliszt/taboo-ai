import Link from "next/link";

export default function HomePage() {
  const title = "Taboo.AI";

  return (
    <main className="h-full w-full overflow-auto">
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
    </main>
  );
}
