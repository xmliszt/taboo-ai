import { uniqueId } from 'lodash';
import { IHighlight } from '../lib/types/highlight.interface';
import { sanitizeHighlights } from '../lib/utilities';

interface ResponseDisplayProps {
  target: string | null;
  message: string;
  highlights: IHighlight[];
  author: 'AI' | 'USER';
  faded: boolean;
  inputConfirmed: boolean;
  shouldFadeOut: boolean;
  shouldFadeIn: boolean;
}

export default function InputDisplay(props: ResponseDisplayProps) {
  const applyHighlightsToMessage = (
    message: string,
    highlights: IHighlight[],
    onNormalMessagePart: (s: string) => JSX.Element,
    onHighlightMessagePart: (s: string) => JSX.Element
  ): JSX.Element[] => {
    let parts = [];
    if (highlights.length === 0) parts = [<span key={message}>{message}</span>];
    else {
      let startIndex = 0;
      let endIndex = 0;
      for (const highlight of highlights) {
        endIndex = highlight.start;
        while (/[\W_]/g.test(message[endIndex])) {
          endIndex++;
        }
        // Normal part
        parts.push(
          onNormalMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
        endIndex = highlight.end;
        // Highlighted part
        parts.push(
          onHighlightMessagePart(message.substring(startIndex, endIndex))
        );
        startIndex = endIndex;
      }
      parts.push(onNormalMessagePart(message.substring(endIndex)));
    }
    return parts;
  };

  const makeNormalMessagePart = (message: string) => {
    return (
      <span
        key={uniqueId(message)}
        className={props.faded ? 'text-white-faded' : 'text-white'}
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
          props.author === 'AI' ? 'bg-green text-white' : 'bg-black text-yellow'
        } rounded-2xl px-1 py-1`}
      >
        {message}
      </span>
    );
  };

  const renderResponseMessage = (
    onNormalMessagePart: (s: string) => JSX.Element,
    onHighlightMessagePart: (s: string) => JSX.Element
  ) => {
    const message = props.message;
    const highlights = sanitizeHighlights(props.highlights);
    const parts = applyHighlightsToMessage(
      message,
      highlights,
      onNormalMessagePart,
      onHighlightMessagePart
    );

    return (
      <div
        className={
          'relative h-full transition-opacity ease-in-out flex overflow-hidden scrollbar-hide'
        }
      >
        <p
          className={`absolute bottom-0 left-0 z-10 py-4 w-full max-h-full transition-opacity overflow-y-scroll scrollbar-hide px-8 lg:px-16 text-white dark:text-neon-white
          } ${props.shouldFadeOut ? 'animate-fade-out' : ''} ${
            props.shouldFadeIn ? 'animate-fade-in' : ''
          }`}
        >
          {parts}
        </p>
        {props.inputConfirmed && (
          <p
            className={`absolute bottom-0 left-0 py-4 w-full max-h-full transition-opacity overflow-y-scroll scrollbar-hide px-8 lg:px-16 text-white dark:text-neon-white
            } ${props.shouldFadeOut ? '' : 'animate-ping'}`}
            style={{ maxHeight: '40vh' }}
          >
            {parts}
          </p>
        )}
      </div>
    );
  };

  return (
    <section className={`h-full w-full text-xl lg:text-3xl lg:px-6 px-0`}>
      {renderResponseMessage(makeNormalMessagePart, makeHighlightMessagePart)}
    </section>
  );
}
