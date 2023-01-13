import Link from "next/link";

export default function HomePage() {
  const title = "Taboo.AI";

  return (
    <main>
      <h1 className="text-center text-2xl mt-5 lg:mt-10 lg:text-6xl">
        {title}
      </h1>
      <section className="flex flex-col justify-center items-center h-screen w-screen fixed top-0 left-0">
        <Link
          href="/levels"
          className="border border-neutral-50 text-lg hover:bg-white hover:text-slate-600 transition-all rounded px-5 lg:text-5xl lg:px-10 lg:py-5 lg:rounded-lg"
        >
          START
        </Link>
      </section>
    </main>
  );
}
