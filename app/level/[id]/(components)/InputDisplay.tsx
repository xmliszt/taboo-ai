import { uniqueId } from "lodash";
import { Author } from "../(models)/Author.enum";
import { Highlight } from "../(models)/Chat.interface";

interface ResponseDisplayProps {
  target: string | null;
  message: string;
  highlights: Highlight[];
  author: Author;
}

export default function InputDisplay(props: ResponseDisplayProps) {
  const makeNormalMessagePart = (message: string) => {
    return (
      <span key={uniqueId(message)} className="text-white">
        {message}
      </span>
    );
  };

  const makeHighlightMessagePart = (message: string) => {
    return (
      <span
        key={uniqueId(message)}
        className={`${
          props.author === Author.AI ? "bg-green" : "bg-red"
        } text-yellow`}
      >
        {message}
      </span>
    );
  };

  const renderResponseMessage = () => {
    let target = props.target;
    let message = props.message;
    let highlights = props.highlights;
    var parts = [];
    if (highlights.length === 0 || target === null)
      parts = [<span key={props.message}>{props.message}</span>];
    else {
      var startIndex = 0;
      var endIndex = 0;

      highlights.sort((a, b) => a.start - b.start);

      for (let highlight of highlights) {
        endIndex = highlight.start;
        // Normal part
        parts.push(
          makeNormalMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
        endIndex = highlight.end;
        // Highlighted part
        parts.push(
          makeHighlightMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
      }
      parts.push(makeNormalMessagePart(message.substring(endIndex)));
    }
    return (
      <p
        className="w-full h-full transition-opacity overflow-y-scroll scrollbar-hide md:scrollbar-default"
        style={{ maxHeight: "50vh" }}
      >
        {parts}
      </p>
    );
  };

  return (
    <section className="flex-grow basis-6/12 leading-normal text-base lg:text-5xl lg:px-6 px-0">
      {renderResponseMessage()}
    </section>
  );
}
