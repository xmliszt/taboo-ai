import { Author } from "./Author.enum";
import Chat from "./Chat.interface";

export default function DisplayTextBubble(props: Chat) {
  const highlightSpanClassName = "text-2xl lg:text-2xl bg-yellow-500";
  const unHighlightSpanClassName = "text-xl lg:text-xl";

  const generateMessage = () => {
    var message = props.message;
    var highlights = props.highlights;
    var target = props.target;
    var messageParts = [];
    var part = "";
    var highlighToggle = false;
    var indexKey = 0;
    if (highlights.length === 0)
      return <span className={unHighlightSpanClassName}>{message}</span>;

    for (
      var characterIndex = 0;
      characterIndex < message.length;
      characterIndex++
    ) {
      if (characterIndex === highlights[0]) {
        messageParts.push(
          <span
            key={indexKey}
            className={
              highlighToggle ? highlightSpanClassName : unHighlightSpanClassName
            }
          >
            {part}
          </span>
        );
        highlighToggle ? (highlighToggle = false) : (highlighToggle = true);
        part = "";
        indexKey++;
      }
      if (highlighToggle) {
        part = message.substring(highlights[0], highlights[0] + target.length);
        highlights = highlights.slice(1);
        characterIndex += target.length - 1;
      } else {
        part += message[characterIndex];
      }
    }
    return <>{messageParts}</>;
  };

  return (
    <section
      className={`border p-4 rounded-full text-xl lg:text-lg ${
        props.byWho === Author.AI
          ? "text-white border-white self-start bg-zinc-800"
          : "bg-white text-zinc-700 border-zinc-700 self-end"
      }`}
    >
      {generateMessage()}
    </section>
  );
}
