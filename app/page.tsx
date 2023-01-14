import Link from "next/link";

export default function HomePage() {
  const title = "Taboo.AI";

  return (
    <main>
      <h1 className="text-center text-2xl mt-5 lg:mt-10 lg:text-6xl overflow-hidden">
        {title}
      </h1>
      <section className="flex flex-col justify-center items-center h-screen w-screen fixed top-0 left-0">
        <Link
          href="/levels"
          className="border-8 border-white text-lg bg-black text-white hover:text-black hover:bg-white hover:border-gray transition-all rounded px-5 lg:text-5xl lg:px-10 lg:py-5 lg:rounded-lg"
        >
          START
        </Link>
      </section>
    </main>
  );
}
