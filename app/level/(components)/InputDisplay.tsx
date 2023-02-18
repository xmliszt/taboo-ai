import { uniqueId } from 'lodash';
import { Author } from '../(models)/Author.enum';
import { Highlight } from '../(models)/Chat.interface';
import { applyHighlightsToMessage, sanitizeHighlights } from '../../utilities';

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
            ? 'text-white-faded dark:text-neon-white'
            : 'text-white dark:text-neon-white'
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
            ? 'bg-green dark:bg-neon-green text-whtie dark:text-neon-gray'
            : 'bg-black dark:bg-neon-gray text-yellow dark:text-neon-yellow'
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
