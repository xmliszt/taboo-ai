import { Author } from "./Author.enum";

interface IDisplayTextProps {
  message: string;
  fromWho: Author;
}

export default function DisplayTextBubble(props: IDisplayTextProps) {
  return (
    <section
      className={`border p-4 rounded-full text-sm lg:text-lg ${
        props.fromWho === Author.AI
          ? "text-white border-white self-start bg-zinc-800"
          : "bg-white text-zinc-700 border-zinc-700 self-end"
      }`}
    >
      {props.message}
    </section>
  );
}
