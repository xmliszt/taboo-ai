import React from 'react';
import { round, startCase } from 'lodash';
import { MousePointerClick } from 'lucide-react';

import { Level } from '@/app/level/[id]/server/fetch-level';
import { CopyToClipboardLabel } from '@/app/result/copy-to-clipboard-label';
import { Game } from '@/app/result/server/fetch-game';
import { ResultsAiExplanationInfoDialog } from '@/components/custom/results/results-ai-explanation-info-dialog';
import { StarRatingBar } from '@/components/custom/star-rating-bar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getDifficultyMultipliers } from '@/lib/utilities';
import { cn } from '@/lib/utils';
import {
  calculateTimeScore,
  getCalculatedScore,
  getCompletionSeconds,
  getIndividualRating,
} from '@/lib/utils/gameUtils';

type StatItem = {
  title: string;
  content: React.ReactElement;
  highlights?: Game['scores'][number]['highlights'];
};

type ScoreDetailsAccordionProps = {
  pro: boolean;
  level: Level;
  game: Game;
};

export function ScoreDetailsAccordion(props: ScoreDetailsAccordionProps) {
  const generateHighlightedMessage = (
    idx: number,
    content: string,
    highlights: Game['scores'][number]['highlights']
  ) => {
    let parts;
    if (highlights.length > 0) {
      parts = applyHighlightsToMessage(
        idx,
        content,
        highlights,
        (key, normal) => {
          return <span key={key}>{normal}</span>;
        },
        (key, highlight) => {
          return (
            <span key={key} className='rounded-lg bg-green-400 px-1 text-black'>
              {highlight}
            </span>
          );
        }
      );
    }
    return parts;
  };

  const applyHighlightsToMessage = (
    idx: number,
    message: string,
    highlights: Game['scores'][number]['highlights'],
    onNormalMessagePart: (key: string, s: string) => React.JSX.Element,
    onHighlightMessagePart: (key: string, s: string) => React.JSX.Element
  ): React.JSX.Element[] => {
    let parts = [];
    if (highlights.length === 0) parts = [<span key={`message-${idx}`}>{message}</span>];
    else {
      let startIndex = 0;
      let endIndex = 0;
      for (const highlight of highlights) {
        endIndex = highlight.start_position;
        while (/[\W_]/g.test(message[endIndex])) {
          endIndex++;
        }
        // Normal part
        parts.push(
          onNormalMessagePart(
            `normal-message-${startIndex}-${endIndex}-${idx}`,
            message.substring(startIndex, endIndex)
          )
        );
        startIndex = endIndex;
        endIndex = highlight.end_position;
        // Highlighted part
        parts.push(
          onHighlightMessagePart(
            `highlight-message-${startIndex}-${endIndex}-${idx}`,
            message.substring(startIndex, endIndex)
          )
        );
        startIndex = endIndex;
      }
      parts.push(
        onNormalMessagePart(`normal-message-${endIndex}-${idx}`, message.substring(endIndex))
      );
    }
    return parts;
  };

  const generateMobileStatsRow = (key: string, title: string, content: React.ReactElement) => {
    return (
      <div key={key} className='gap-2 px-3 py-1 leading-snug'>
        <span className='font-extrabold text-primary'>{title}: </span>
        {content}
      </div>
    );
  };

  const renderMessageBubble = (
    idx: number,
    chat: Game['scores'][number]['conversations'][number],
    score: Game['scores'][number],
    isLastBubble = false
  ) => {
    if (chat.role === 'assistant') {
      return isLastBubble
        ? generateHighlightedMessage(idx, chat.content, score.highlights)
        : chat.content;
    } else if (chat.role === 'error') {
      return <span className='text-slate-500'>{chat.content}</span>;
    } else if (chat.role === 'user') {
      return `${chat.content}`;
    } else {
      return <></>;
    }
  };

  const generateConversation = (score: Game['scores'][number]): React.ReactElement => {
    return (
      <div
        key={score.score_id}
        className='flex w-full flex-col gap-4 bg-secondary p-4 text-secondary-foreground'
      >
        {score.conversations.map((chat, idx) => (
          <p
            key={`accordion-content-chat-bubble-${score.score_id}-${idx}`}
            style={{ wordBreak: 'break-word' }}
            className={cn(
              chat.role === 'user'
                ? 'chat-bubble-right'
                : chat.role === 'assistant'
                  ? 'chat-bubble-left !bg-primary-foreground !text-primary'
                  : chat.role === 'error'
                    ? 'chat-bubble-left !bg-primary-foreground'
                    : 'hidden'
            )}
          >
            {renderMessageBubble(idx, chat, score, idx === score.conversations.length - 1)}
          </p>
        ))}
      </div>
    );
  };

  const generateStatsItems = (score: Game['scores'][number]): StatItem[] => {
    const timeMultiplier = getDifficultyMultipliers(props.level.difficulty).timeMultiplier;
    const promptMultiplier = getDifficultyMultipliers(props.level.difficulty).promptMultiplier;
    const items: StatItem[] = [
      {
        title: 'Ratings',
        content: (
          <StarRatingBar
            className='inline-flex'
            rating={getIndividualRating(
              getCalculatedScore(score.duration, score.ai_score ?? 0, props.level.difficulty)
            )}
            maxRating={5}
            size={15}
          />
        ),
      },
      {
        title: 'Total score',
        content: (
          <span>
            {getCalculatedScore(
              score.duration,
              score.ai_score ?? 0,
              props.level.difficulty
            ).toFixed(2)}
          </span>
        ),
      },
      {
        title: 'Total time taken',
        content: <span>{`${getCompletionSeconds(score.duration)} seconds`}</span>,
      },
      {
        title: `Time score (${timeMultiplier * 100}%)`,
        content: (
          <span>{`${calculateTimeScore(score.duration).toString()} x ${
            timeMultiplier * 100
          }% = ${round(calculateTimeScore(score.duration) * timeMultiplier, 2).toFixed(2)}`}</span>
        ),
      },
    ];
    if (score.ai_score !== undefined) {
      items.push({
        title: `Clue score (${promptMultiplier * 100}%)`,
        content: (
          <span>{`${score.ai_score.toFixed(2)} x ${promptMultiplier * 100}% = ${round(
            score.ai_score * promptMultiplier,
            2
          ).toFixed(2)}`}</span>
        ),
      });
    }
    if (score.taboo_words.length > 0) {
      items.push({
        title: 'Taboo words',
        content: <span>{score.taboo_words.map(startCase).join(', ')}</span>,
      });
    }
    if (score.ai_score !== undefined) {
      items.push({
        title: 'AI score',
        content: <span>{score.ai_score.toFixed(2)}</span>,
      });
    }
    if (score.ai_explanation !== undefined) {
      items.push({
        title: 'AI evaluation',
        content: (
          <span>
            {!props.pro && <ResultsAiExplanationInfoDialog pro={props.pro} />}
            {score.ai_explanation}
          </span>
        ),
      });
    }
    if (score.ai_suggestion && score.ai_suggestion.length > 0) {
      items.push({
        title: 'AI suggestions',
        content: (
          <span>
            {props.pro && <ResultsAiExplanationInfoDialog pro={props.pro} />}
            <div className='ml-2 mt-2 flex flex-col gap-1'>
              {score.ai_suggestion.map((suggestion, idx) => (
                <span key={idx} className='flex items-center'>
                  {idx + 1}. <CopyToClipboardLabel text={suggestion} />
                </span>
              ))}
            </div>
          </span>
        ),
      });
    }
    return items;
  };

  return (
    <Accordion type='multiple' defaultValue={['1']}>
      {props.game.scores.map((score) => (
        <AccordionItem key={score.score_index} value={score.score_index.toString()}>
          <AccordionTrigger key={score.score_index} className='hover:no-underline'>
            <div className='flex w-full flex-row items-center justify-between gap-2 text-foreground transition-colors hover:text-muted-foreground'>
              <div className='flex flex-grow flex-row items-center justify-between gap-2'>
                <span className='text-left leading-snug'>{startCase(score.target_word)}</span>
                <div className='flex max-w-[120px] animate-pulse flex-row items-center gap-1 whitespace-nowrap text-xs text-muted-foreground'>
                  <MousePointerClick size={15} />
                </div>
              </div>
              <div className='flex flex-row items-center'>
                <span className='font-extrabold leading-snug' key={score.score_index}>
                  {getCalculatedScore(
                    score.duration,
                    score.ai_score ?? 0,
                    props.level.difficulty
                  ).toFixed(2)}
                  /{100}
                </span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent key={score.score_index} className='rounded-lg bg-secondary'>
            {generateConversation(score)}
            {generateStatsItems(score).map((item) => {
              return generateMobileStatsRow(score.score_index.toString(), item.title, item.content);
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
