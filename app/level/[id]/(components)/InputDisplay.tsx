import { uniqueId } from "lodash";
import { Author } from "../(models)/Author.enum";
import { Highlight } from "../(models)/Chat.interface";

interface ResponseDisplayProps {
  target: string | null;
  message: string;
  highlights: Highlight[];
  author: Author;
  faded: boolean;
  inputConfirmed: boolean;
  shouldFadeOut: boolean;
  shouldFadeIn: boolean;
}

export default function InputDisplay(props: ResponseDisplayProps) {
  const makeNormalMessagePart = (message: string) => {
    return (
      <span
        key={uniqueId(message)}
        className={
          props.faded
            ? "text-white-faded dark:text-neon-red-light"
            : "text-white dark:text-neon-white"
        }
      >
        {message}
      </span>
    );
  };

  const makeHighlightMessagePart = (message: string) => {
    return (
      <span
        key={uniqueId(message)}
        className={`${
          props.author === Author.AI
            ? "bg-green dark:bg-neon-green"
            : "bg-red dark:bg-neon-red"
        } text-yellow dark:text-neon-gray rounded-2xl px-3 py-1`}
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
      <div
        className={
          "relative h-full transition-opacity ease-in-out flex overflow-hidden scrollbar-hide"
        }
      >
        <p
          className={`absolute bottom-0 left-0 z-10 py-4 w-full max-h-full transition-opacity overflow-y-scroll scrollbar-hide px-8 lg:px-16 text-white dark:text-neon-white
          } ${props.shouldFadeOut ? "animate-fade-out" : ""} ${
            props.shouldFadeIn ? "animate-fade-in" : ""
          }`}
        >
          {parts}
        </p>
        {props.inputConfirmed && (
          <p
            className={`absolute bottom-0 left-0 py-4 w-full max-h-full transition-opacity overflow-y-scroll scrollbar-hide px-8 lg:px-16 text-white dark:text-neon-white
            } ${props.shouldFadeOut ? "" : "animate-ping"}`}
            style={{ maxHeight: "40vh" }}
          >
            {parts}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className={`h-full w-full text-xl lg:text-3xl lg:px-6 px-0`}>
      {renderResponseMessage()}
    </section>
  );
}
