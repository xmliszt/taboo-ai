'use client';

import copy from 'clipboard-copy';
import { useState, useEffect, useRef } from 'react';
import ILevel from '../../types/level.interface';
import { IDisplayScore } from '../../types/score.interface';
import {
  getScoresCache,
  getLevelCache,
  getUser,
  clearScores,
  cacheScore,
  setCachedGame,
  cacheLevel,
} from '../../lib/cache';
import { MdShare } from 'react-icons/md';
import html2canvas from 'html2canvas';
import _, { uniqueId } from 'lodash';
import { isMobile } from 'react-device-detect';
import { Highlight } from '../../types/chat.interface';
import {
  buildLevelForDisplay,
  buildScoresForDisplay,
  delayRouterPush,
} from '../../lib/utilities';
import { useRouter } from 'next/navigation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {
  getGameByPlayerNicknameFilterByDate,
  saveGame,
} from '../../lib/services/frontend/gameService';
import LoadingMask from '../(components)/LoadingMask';
import ConfirmPopUp from '../(components)/ConfirmPopUp';
import { CONSTANTS } from '../../lib/constants';
import { CgSmile } from 'react-icons/cg';
import { getScoresByGameID } from '../../lib/services/frontend/scoreService';
import { getHighlights } from '../../lib/services/frontend/highlightService';
import IGame from '../../types/game.interface';
import IUser from '../../types/user.interface';
import moment from 'moment';
import { getDailyLevelByName } from '../../lib/services/frontend/levelService';
import useToast from '../../lib/hook/useToast';

interface StatItem {
  title: string;
  content: string;
  isResponse?: boolean;
  highlights?: Highlight[];
}

interface PrompPopupConfiguration {
  title: string;
  content: string;
  yesButtonText: string;
  noButtonText: string;
}

enum PromptStep {
  Idle = 0,
  PromptSaveResult = 1,
  PromptIsVisible = 2,
  Finished = 3,
}

interface ResultPageProps {}

export default function ResultPage(props: ResultPageProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [scores, setScores] = useState<IDisplayScore[]>([]);
  const [level, setLevel] = useState<ILevel>();
  const [displayedLevelName, setDisplayedLevelName] = useState<string | null>();
  const [displayedLevelTopic, setDisplayedLevelTopic] = useState<
    string | null
  >();
  const [total, setTotal] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [showSaveResultPrompt, setShowSaveResultPrompt] =
    useState<boolean>(false);
  const [promptTitle, setPromptTitle] = useState('');
  const [promptContent, setPromptContent] = useState('');
  const [yesButtonText, setYesButtonText] = useState('Yes');
  const [noButtonText, setNoButtonText] = useState('No');
  const [promptStep, setPromptStep] = useState<number>(0);
  const [user, setUser] = useState<IUser | undefined>();
  const screenshotRef = useRef<HTMLTableElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const getCompletionSeconds = (completion: number): number => {
    return completion <= 0 ? 1 : completion;
  };

  useEffect(() => {
    !isMounted && setIsMounted(true);
    isMounted && checkUserStatus();
  }, [isMounted]);

  useEffect(() => {
    switch (promptStep) {
      case PromptStep.PromptSaveResult:
        setShowSaveResultPrompt(true);
        break;
      case PromptStep.PromptIsVisible:
        configurePromptPopUp({
          title: 'Show Your Prompts?',
          content:
            'Would you like to keep your prompts (your inputs in the game) visible to the public?',
          yesButtonText: 'Sure! Keep them visible!',
          noButtonText: 'No, they are secrets!',
        });
        break;
      case PromptStep.Finished:
        setPromptStep(PromptStep.Idle);
        setShowSaveResultPrompt(false);
        break;
      default:
        break;
    }
  }, [promptStep]);

  const checkUserStatus = async () => {
    const user = getUser();
    const level = getLevelCache();
    const scores = getScoresCache();
    level?.isDaily && setDisplayedLevelName(level?.dailyLevelName);
    level?.isDaily && setDisplayedLevelTopic(level?.dailyLevelTopic);
    if (user) {
      setUser(user);
      if (level?.isDaily) {
        try {
          setIsLoading(true);
          setLoadingMessage('Restoring your saved game...');
          await restoreCurrentUserGameForToday(user);
          setIsLoading(false);
          return;
        } catch {
          setIsLoading(false);
          if (!scores || !level) {
            toast({
              title:
                'Sorry! You do not have any saved game records. Try play some games before accessing the scores!',
              status: 'warning',
              duration: 3000,
            });
            delayRouterPush(router, '/');
            return;
          } else {
            setLevel(level);
            updateDisplayedScores(scores);
            if (level.isDaily) {
              showResultSubmissionPrompt();
            }
            return;
          }
        }
      }
    }
    if (!scores || !level) {
      toast({
        title:
          'Sorry! You do not have any saved game records. Try play some games before accessing the scores!',
        status: 'warning',
        duration: 3000,
      });
      delayRouterPush(router, '/');
      return;
    } else {
      setLevel(level);
      updateDisplayedScores(scores);
      if (level.isDaily) {
        showJoinLeaderboardPrompt();
      }
      return;
    }
  };

  const saveGameAsync = async (promptVisible: boolean) => {
    const level = getLevelCache();
    const scores = getScoresCache();
    const user = getUser();
    if (level && scores && user) {
      try {
        const savedGame = await saveGame(
          level,
          scores,
          user.nickname,
          user.recovery_key,
          promptVisible
        );
        setCachedGame(savedGame);
        toast({
          title:
            'Congratulations! Your results have been submitted to global leaderboard successfully!',
          status: 'success',
        });
      } catch (error) {
        console.error(error);
        toast({
          title:
            'We are currently unable to submit the scores. Please try again later.',
          status: 'error',
        });
      }
    }
  };

  const restoreCurrentUserGameForToday = async (user: IUser) => {
    const todayGameDoneByUser = await getGameByPlayerNicknameFilterByDate(
      user.nickname,
      moment()
    );
    if (todayGameDoneByUser) {
      const dailyLevel = await getDailyLevelByName(todayGameDoneByUser.level);
      if (dailyLevel) {
        const level = buildLevelForDisplay(dailyLevel);
        setLevel(level);
        cacheLevel(level);
        setDisplayedLevelName(level.dailyLevelName);
        setDisplayedLevelTopic(level.dailyLevelTopic);
        setIsLoading(true);
        await restoreGameScores(level, todayGameDoneByUser);
        return;
      }
    }
    throw Error('Unable to restore scores for user!');
  };

  const restoreGameScores = async (level: ILevel, game: IGame) => {
    try {
      const scores = await getScoresByGameID(game.game_id);
      clearScores();
      const displayScores: IDisplayScore[] = [];
      for (const score of scores) {
        const highlights = await getHighlights(game.game_id, score.score_id);
        const displayScore = buildScoresForDisplay(level, score, highlights);
        displayScores.push(displayScore);
        cacheScore(displayScore);
      }
      updateDisplayedScores(displayScores);
      setCachedGame(game);
      toast({
        title: 'Your daily challenge results have been restored!',
        status: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Sorry, we are unable to restore the game results.',
        status: 'error',
      });
    }
  };

  const showResultSubmissionPrompt = () => {
    const user = getUser();
    configurePromptPopUp({
      title: 'Submit Your Results?',
      content: `Hi ${user?.nickname}! Would you like to submit your results to the global leaderboard?`,
      yesButtonText: 'Sure!',
      noButtonText: 'Maybe next time!',
    });
    setPromptStep(PromptStep.PromptSaveResult);
  };

  const showJoinLeaderboardPrompt = () => {
    confirmAlert({
      title: 'Join the global leaderboard 🎉',
      message:
        'Tell us your nickname and join the others in the global leaderboard 🏅!',
      buttons: [
        {
          label: 'Yes',
          onClick: () => router.push('/signup'),
        },
        {
          label: 'I want to recover my game records!',
          onClick: () => router.push('/recovery'),
        },
        {
          label: 'No',
        },
      ],
    });
  };

  const configurePromptPopUp = (configuration: PrompPopupConfiguration) => {
    setPromptTitle(configuration.title);
    setPromptContent(configuration.content);
    setYesButtonText(configuration.yesButtonText);
    setNoButtonText(configuration.noButtonText);
  };

  const onPromptYesButtonClick = async () => {
    if (promptStep === PromptStep.PromptSaveResult) {
      setIsLoading(true);
      setLoadingMessage('Submitting your scores to the leaderboard...');
      await saveGameAsync(true);
      setIsLoading(false);
      setPromptStep(PromptStep.Finished);
      // setPromptStep(PromptStep.PromptIsVisible);
    }
  };

  const onPromptNoButtonClick = async () => {
    if (promptStep === PromptStep.PromptIsVisible) {
      setIsLoading(true);
      setLoadingMessage('Submitting your scores to the leaderboard...');
      await saveGameAsync(false);
      setIsLoading(false);
    }
    setPromptStep(PromptStep.Finished);
  };

  const b64toBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  const openShare = () => {
    confirmAlert({
      title: 'Share Your Scores!',
      message: 'Choose how you want to share your scores...',
      buttons: [
        { label: 'Plain Text', onClick: sharePlainText },
        { label: 'Screenshot', onClick: shareScreenshot },
      ],
    });
  };

  const generateShareText = (): string => {
    const level = getLevelCache();
    const parts: string[] = [];
    if (totalScore > 0) {
      parts.push(
        `I scored a total of ${totalScore} in https://taboo-ai.vercel.app/ !`
      );
    }
    const topic = generateTopicName();
    if (topic) {
      parts.push(`The topic of this game is: ${topic}.`);
    }
    if (level?.difficulty) {
      const difficultyString = getDifficulty(level?.difficulty);
      parts.push(`The difficulty level of this game is: ${difficultyString}.`);
    }
    if (parts.length > 0) {
      if (level?.isDaily) {
        parts.push(
          `Join me in the Daily Challenge and compete against other players around the world in the daily Wall of Fame!`
        );
      } else {
        parts.push(
          `Join me to explore different topics and have fun playing the game of Taboo against AI!`
        );
      }
    } else {
      parts.push(
        `I completed a round of game in https://taboo-ai.vercel.app/ ! Join me to explore different topics and have fun playing the game of Taboo against AI!`
      );
    }
    return parts.join(' ');
  };

  const sharePlainText = () => {
    const text = generateShareText();
    performNavigatorShare(text);
  };

  const shareScreenshot = () => {
    if (screenshotRef.current) {
      html2canvas(screenshotRef.current, {
        scale: 2,
        backgroundColor: '#4c453e',
      }).then((canvas) => {
        const text = generateShareText();
        const href = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
        const downloadName = `taboo-ai-scores-${moment().format(
          'DDMMYYYYHHmmss'
        )}.png`;
        performNavigatorShare(text, href, downloadName);
      });
    }
  };

  const performNavigatorShare = (
    title: string,
    imageLink?: string,
    imageName?: string
  ) => {
    const link = document.createElement('a');
    if (imageLink && imageName) {
      link.href = imageLink;
      link.download = imageName;
      if (navigator.share) {
        navigator
          .share({
            title: title,
            files: [
              new File(
                [b64toBlob(imageLink.split(',')[1], 'image/octet-stream')],
                imageName,
                {
                  type: 'image/png',
                }
              ),
            ],
          })
          .then(() => console.log('Shared'))
          .catch((error) => {
            console.log('Error sharing:', error);
            link.click();
          });
      } else {
        link.click();
      }
    } else {
      // Plain Text Sharing
      if (navigator.share) {
        navigator
          .share({
            title:
              totalScore > 0
                ? `I scored ${totalScore} in Taboo.AI!`
                : 'Look at my results at Taboo.AI!',
            text: title,
          })
          .then(() => {
            console.log('Shared');
            return;
          })
          .catch(console.error);
      }
      copy(title)
        .then(() => {
          toast({
            title: 'Sharing content has been copied to clipboard!',
            status: 'success',
            duration: 2000,
          });
        })
        .catch((error) => {
          console.error(error);
          toast({
            title:
              'Sorry, we are unable to generate the sharing content at the moment. Please try again later.',
            status: 'error',
          });
        });
    }
  };

  const getDifficulty = (difficulty: number): string => {
    switch (difficulty) {
      case 1:
        return 'Easy';
      case 2:
        return 'Medium';
      case 3:
        return 'Hard';
      default:
        return 'Unknown';
    }
  };

  const applyHighlightsToMessage = (
    message: string,
    highlights: Highlight[],
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

  const generateDesktopResponseCellContent = (
    responseText: string,
    highlights: Highlight[] = []
  ): JSX.Element => {
    let parts: JSX.Element[] = [];
    if (highlights.length > 0) {
      parts = applyHighlightsToMessage(
        responseText,
        highlights,
        (normal) => {
          return <span key={uniqueId()}>{normal}</span>;
        },
        (highlight) => {
          return (
            <span
              key={uniqueId()}
              className='bg-green dark:bg-neon-green p-1 rounded-lg text-white dark:text-neon-gray'
            >
              {highlight}
            </span>
          );
        }
      );
    }
    let contentElement: JSX.Element;
    if (parts.length > 0) {
      contentElement = <p>{parts}</p>;
    } else {
      contentElement = <p>{responseText}</p>;
    }
    return contentElement;
  };

  const generateMobileStatsRow = (
    title: string,
    content: string,
    isResponse = false,
    highlights: Highlight[] = []
  ) => {
    let parts: JSX.Element[] = [];
    if (isResponse && highlights.length > 0) {
      parts = applyHighlightsToMessage(
        content,
        highlights,
        (normal) => {
          return <span key={uniqueId()}>{normal}</span>;
        },
        (highlight) => {
          return (
            <span
              key={uniqueId()}
              className='bg-green dark:bg-neon-green p-1 rounded-lg text-white dark:text-neon-gray'
            >
              {highlight}
            </span>
          );
        }
      );
    }
    let contentElement: JSX.Element;
    if (parts.length > 0) {
      contentElement = <p>{parts}</p>;
    } else {
      contentElement = <p>{content}</p>;
    }
    return (
      <div key={title} className='p-3'>
        <span
          key={uniqueId()}
          className='font-extrabold text-black border-b-2 border-black dark:text-neon-blue dark:border-neon-blue'
        >
          {title}
        </span>
        {contentElement}
      </div>
    );
  };

  const calculateScore = (score: IDisplayScore): number => {
    return _.round(
      score.difficulty * (1000 / getCompletionSeconds(score.completion)),
      2
    );
  };

  const updateDisplayedScores = (displayScores: IDisplayScore[]) => {
    let total = 0;
    let totalScore = 0;
    for (const score of displayScores) {
      total += getCompletionSeconds(score.completion);
      totalScore += _.round(
        score.difficulty * (1 / getCompletionSeconds(score.completion)) * 1000,
        2
      );
    }
    totalScore = _.round(totalScore, 2);
    setScores(displayScores);
    setTotal(total);
    setTotalScore(totalScore);
    window.dispatchEvent(
      new CustomEvent<{ score: number }>(CONSTANTS.eventKeys.scoreComputed, {
        detail: { score: totalScore },
      })
    );
  };

  const generateTopicName = (): string => {
    const parts: string[] = [];
    if (displayedLevelTopic) {
      parts.push(displayedLevelTopic);
    }
    if (displayedLevelName) {
      parts.push(displayedLevelName);
    }
    const dailyTopicName: string | null =
      parts.length <= 0 ? null : parts.join(' - ');
    const topicName = dailyTopicName ?? level?.name ?? 'Unknown';
    return topicName;
  };

  const generateStatsItems = (score: IDisplayScore): StatItem[] => {
    return [
      {
        title: 'Player Inputs',
        content: score.question,
      },
      {
        title: "AI's Response",
        content: score.response,
        isResponse: true,
        highlights: score.responseHighlights,
      },
      {
        title: 'Total Time Taken',
        content: `${getCompletionSeconds(score.completion)} seconds`,
      },
      {
        title: 'Score Calculation',
        content: `${score.difficulty} * (1 / ${getCompletionSeconds(
          score.completion
        )}) x 1000 = ${calculateScore(score)}`,
      },
    ];
  };

  const generateMobileScoreStack = (score: IDisplayScore) => {
    return (
      <div
        key={score.id}
        className='border-2 border-white bg-white text-black flex flex-col gap-2 rounded-2xl dark:border-neon-red dark:bg-neon-gray dark:text-neon-white'
      >
        <div className='bg-black dark:bg-neon-black dark:drop-shadow-xl text-white p-3 rounded-2xl flex flex-row justify-between'>
          <span key={uniqueId()}>{score.target}</span>
          <span className='font-extrabold' key={uniqueId()}>
            Score: {calculateScore(score)}
          </span>
        </div>
        {generateStatsItems(score).map((item) => {
          return generateMobileStatsRow(
            item.title,
            item.content,
            item.isResponse ?? false,
            item.highlights
          );
        })}
      </div>
    );
  };

  const renderMobile = () => {
    return (
      <div className='w-full flex flex-col gap-6 mb-8 mt-10 px-4'>
        <div className='text-center flex justify-center items-center'>
          <span className='dark:bg-neon-gray bg-black rounded-2xl p-3 dark:border-neon-white border-2 drop-shadow-lg'>
            Topic: {generateTopicName()}
          </span>
        </div>
        <div className='p-2 dark:border-neon-yellow dark:border-4 rounded-2xl bg-white text-black dark:bg-neon-white dark:text-neon-gray flex flex-col gap-2 justify-center'>
          <div className='flex flex-row justify-between'>
            <span>Total Time Taken: </span>
            <span className='font-extrabold'>{total} seconds</span>
          </div>
          <div className='flex flex-row justify-between'>
            <span>Total Score:</span>
            <span className='font-extrabold'>{_.round(totalScore, 2)}</span>
          </div>
          <div className='flex flex-row justify-between'>
            <span>Difficulty:</span>
            <span className='font-extrabold'>
              {level?.difficulty ?? 1}{' '}
              <span>({getDifficulty(level?.difficulty ?? 1)})</span>
            </span>
          </div>
        </div>
        {scores.map((score) => {
          return generateMobileScoreStack(score);
        })}
      </div>
    );
  };

  const renderDesktop = () => {
    const headers = [
      'Index',
      'Taboo Word',
      'Player Inputs',
      "AI's Response",
      'Time Taken',
      'Score (Difficulty x (1/Time Taken) x 1000)',
    ];
    return (
      <div className='mt-12 lg:mt-16 px-4 w-full h-full text-center'>
        <div className='font-mono relative rounded-xl lg:rounded-3xl h-full bg-white dark:bg-neon-black overflow-scroll scrollbar-hide border-4 border-white dark:border-neon-green'>
          <table className='relative table-fixed w-full'>
            <thead className='relative font-semibold uppercase bg-black text-white dark:bg-neon-gray dark:text-neon-white h-24 rounded-t-xl lg:rounded-t-3xl'>
              <tr>
                {headers.map((header, idx) => (
                  <th
                    className={`px-4 pb-2 pt-4 font-semibold text-left text-xs lg:text-xl ${
                      idx == 2
                        ? 'w-3/12'
                        : idx == 3
                        ? 'w-3/12'
                        : idx == 5
                        ? 'w-3/12'
                        : 'w-1/12'
                    }`}
                    key={header}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y text-left text-xs lg:text-xl text-gray bg-white dark:text-neon-white dark:bg-neon-black'>
              <tr>
                <td
                  colSpan={3}
                  className='w-full h-12 text-xl lg:text-3xl text-white-faded bg-white dark:text-neon-red dark:bg-neon-black'
                >
                  {' '}
                  Topic:{' '}
                  <span className='block text-black dark:text-neon-white text-ellipsis overflow-hidden break-words'>
                    {generateTopicName()}
                  </span>
                </td>
                <td
                  colSpan={3}
                  className='w-full h-12 text-xl lg:text-3xl text-white-faded bg-white dark:text-neon-red dark:bg-neon-black'
                >
                  {' '}
                  Difficulty:{' '}
                  <span className='block text-black dark:text-neon-white'>
                    {level?.difficulty ?? 1}
                    <span>({getDifficulty(level?.difficulty ?? 1)})</span>
                  </span>
                </td>
              </tr>
              {scores.map((score) => (
                <tr key={score.id}>
                  <td className='p-3 font-medium'>{score.id}</td>
                  <td className='p-3 font-medium'>{score.target}</td>
                  <td className='p-3 font-medium'>{score.question}</td>
                  <td className='p-3 font-medium'>
                    {generateDesktopResponseCellContent(
                      score.response,
                      score.responseHighlights
                    )}
                  </td>
                  <td className='p-3 font-medium'>
                    {getCompletionSeconds(score.completion)} seconds
                  </td>
                  <td className='p-3 font-medium'>
                    {score.difficulty} x 1/
                    {getCompletionSeconds(score.completion)} (seconds) x 1000 ={' '}
                    {_.round(
                      score.difficulty *
                        (1 / getCompletionSeconds(score.completion)) *
                        1000,
                      2
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan={4}
                  className='px-3 pt-4 pb-8 border-collapse font-extrabold'
                >
                  Total Time Taken
                </td>
                <td colSpan={2} className='px-3 pt-4 pb-8 font-extrabold'>
                  {total} seconds
                </td>
              </tr>
              <tr>
                <td
                  colSpan={5}
                  className='px-3 pt-4 pb-8 border-collapse font-extrabold'
                >
                  Total Score
                </td>
                <td className='px-3 pt-4 pb-8 font-extrabold'>
                  {_.round(totalScore, 2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <section className='relative'>
      <ConfirmPopUp
        disabled={isLoading}
        show={showSaveResultPrompt}
        title={promptTitle}
        content={promptContent}
        buttons={[
          {
            label: yesButtonText,
            onClick: onPromptYesButtonClick,
          },
          {
            label: noButtonText,
            onClick: onPromptNoButtonClick,
          },
        ]}
      />
      <LoadingMask
        key='loading-mask'
        isLoading={isLoading}
        message={loadingMessage}
      />
      <div className='flex justify-center'>
        <h1 className='fixed z-50 h-20 py-4 text-center'>Game Results</h1>
      </div>
      <section
        ref={screenshotRef}
        className='!leading-screenshot pb-20 lg:pb-48 pt-4'
      >
        {user && (
          <h1 className='w-full mt-10 lg:mt-16 text-center z-50'>
            <CgSmile className='inline' /> Hi {user.nickname}!{' '}
            <CgSmile className='inline' />
          </h1>
        )}
        {isMobile ? renderMobile() : renderDesktop()}
      </section>
      <div className='fixed bottom-2 z-40 w-full text-center py-4'>
        {level?.isDaily ? (
          <button
            id='leaderboard'
            data-style='none'
            className='h-12 lg:h-24  w-4/5 !drop-shadow-[0px_10px_20px_rgba(0,0,0,1)]'
            onClick={() => {
              router.push('/leaderboard');
            }}
          >
            <div className='text-lg lg:text-2xl !text-white hover:!text-black !bg-black dark:!bg-neon-gray hover:!bg-yellow hover:dark:!bg-neon-green color-gradient-animated-background-golden flex items-center justify-center'>
              Go To The Leaderboard
            </div>
          </button>
        ) : (
          <button
            className='h-12 lg:h-24 lg:text-2xl w-4/5 !drop-shadow-[0px_10px_20px_rgba(0,0,0,1)] !bg-green dark:!bg-neon-gray !text-white text-lg hover:!text-black hover:!bg-yellow hover:dark:!bg-neon-green'
            onClick={() => {
              router.push('/level');
            }}
          >
            Play This Topic Again
          </button>
        )}
      </div>
      <button
        id='share'
        data-style='none'
        aria-label='result button'
        className='text-2xl lg:text-5xl fixed top-4 right-14 lg:right-24 hover:opacity-50 transition-all ease-in-out z-40'
        onClick={openShare}
      >
        <MdShare />
      </button>
    </section>
  );
}
