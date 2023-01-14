import { uniqueId } from "lodash";

interface ResponseDisplayProps {
  target: string | null;
  message: string;
  highlights: number[];
}

export default function ResponseDisplay(props: ResponseDisplayProps) {
  const makeNormalMessagePart = (message: string) => {
    return (
      <span key={uniqueId(message)} className="text-white">
        {message}
      </span>
    );
  };

  const makeHighlightMessagePart = (message: string) => {
    return (
      <span key={uniqueId(message)} className="bg-yellow-500 text-black">
        {message}
      </span>
    );
  };

  const renderResponseMessage = () => {
    let target = props.target;
    let message = props.message;
    let highlights = props.highlights;
    if (highlights.length === 0 || target === null)
      return <p className="transition-opacity">{props.message}</p>;
    else {
      var parts = [];
      var startIndex = 0;
      var endIndex = 0;
      for (let i of highlights) {
        endIndex = i;
        // Normal part
        parts.push(
          makeNormalMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
        endIndex = startIndex + target.length;
        // Highlighted part
        parts.push(
          makeHighlightMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
      }
    }
    return <span>{parts}</span>;
  };

  return (
    <section className="w-full flex justify-center items-center text-5xl px-6">
      {renderResponseMessage()}
    </section>
  );
}
