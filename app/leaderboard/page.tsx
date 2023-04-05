'use client';

import { isMobile } from 'react-device-detect';
import LoadingMask from '../(components)/LoadingMask';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import { getAllGamesByLevel } from '../../lib/services/frontend/gameService';
import { getDailyLevel } from '../../lib/services/frontend/levelService';
import IGame from '../../types/game.interface';
import { GiTrophy, GiLaurelCrown } from 'react-icons/gi';
import { MdLeaderboard } from 'react-icons/md';
import { getUser } from '../../lib/cache';
import Link from 'next/link';
import useToast from '../../lib/hook/useToast';
import IDailyLevel from '../../types/dailyLevel.interface';

interface LeaderboardPageProps {}

interface LeaderboardRowData {
  game_id: string;
  rank: number;
  nickname: string;
  total_score: number;
}

const LeaderboardPage = (props: LeaderboardPageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<moment.Moment>(moment());
  const [currentDayLevel, setCurrentDayLevel] = useState<IDailyLevel | null>();
  const [isNextDayDisabled, setIsNextDayDisabled] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardRowData[]>(
    []
  );
  const [myRank, setMyRank] = useState<number | undefined>();
  const { toast } = useToast();

  const onPrevDate = () => {
    setCurrentDate((d) => moment(d).subtract(1, 'day'));
  };

  const onNextDate = () => {
    setCurrentDate((d) => moment(d).add(1, 'day'));
  };

  useEffect(() => {
    fetchLeaderboardData();
    if (currentDate.isSame(moment(), 'day')) {
      setIsNextDayDisabled(true);
    } else {
      setIsNextDayDisabled(false);
    }
  }, [currentDate]);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const currentDayLevel = await getDailyLevel(currentDate);
      setCurrentDayLevel(currentDayLevel);
      if (!currentDayLevel) {
        setLeaderboardData([]);
        setMyRank(undefined);
      } else {
        const { games } = await getAllGamesByLevel(currentDayLevel.name);
        games.sort((a, b) => b.total_score - a.total_score);
        buildLeaderboardData(games);
      }
    } catch (error) {
      console.error(error);
      toast({
        title:
          'Sorry we are unable to fetch the data for current leaderboard! Please try again later!',
        status: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buildLeaderboardData = (gameData: IGame[]) => {
    const leaderboardData: LeaderboardRowData[] = [];
    let rank = 0;
    let prevScore = Infinity;
    gameData.forEach((game) => {
      if (game.total_score < prevScore) {
        rank += 1;
        prevScore = game.total_score;
      }
      leaderboardData.push({
        game_id: game.game_id,
        rank: rank,
        nickname: game.player_nickname,
        total_score: game.total_score,
      });
    });
    const currentUser = getUser();
    if (currentUser) {
      const userRow = leaderboardData.find(
        (data) => data.nickname === currentUser.nickname
      );
      if (userRow) {
        setMyRank(userRow.rank);
      } else {
        setMyRank(undefined);
      }
    }
    setLeaderboardData(leaderboardData);
  };

  const getPosition = (rank: number): string => {
    switch (rank) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return `${rank}th`;
    }
  };

  const renderMobileDateSelector = () => {
    return (
      <>
        <section
          id='date-selector'
          className='w-full h-12 flex flex-row gap-4 justify-between items-center p-2 bg-white dark:bg-neon-gray rounded-full text-base'
        >
          <button
            data-style='none'
            onClick={onPrevDate}
            aria-label='Go to previous day'
            className={`bg-black dark:bg-neon-white text-white dark:text-neon-black rounded-full aspect-square py-1 px-3 drop-shadow-lg flex flex-row gap-1 justify-center items-center`}
          >
            <FaChevronLeft />
          </button>
          <div className='flex-grow text-center text-black dark:text-neon-white font-extrabold lg:text-xl flex flex-row gap-2 justify-center'>
            {currentDate.format('ddd, MMM Do YYYY')}
          </div>
          <button
            disabled={isNextDayDisabled}
            data-style='none'
            onClick={onNextDate}
            aria-label='Go to next day'
            className={`bg-black dark:bg-neon-white text-white dark:text-neon-black rounded-full aspect-square py-1 px-3 drop-shadow-lg flex flex-row gap-1 justify-center items-center`}
          >
            <FaChevronRight />
          </button>
        </section>
        {!currentDate.isSame(moment(), 'day') && (
          <button
            data-style='none'
            className='underline h-8 text-red-light dark:text-neon-red-light'
            aria-label='Jump to today date'
            onClick={() => {
              setCurrentDate(moment());
            }}
          >
            Jump To Today
          </button>
        )}
      </>
    );
  };

  const renderDesktopSelector = () => {
    return (
      <section
        id='date-selector'
        className='w-full h-12 flex flex-row gap-4 justify-between items-center p-2 bg-white dark:bg-neon-gray rounded-full text-base'
      >
        <button
          data-style='none'
          onClick={onPrevDate}
          aria-label='Go to previous day'
          className={`bg-black dark:bg-neon-white text-white dark:text-neon-black rounded-full py-1 px-3 drop-shadow-lg flex flex-row gap-1 justify-center items-center hover:opacity-50 transition-all ease-in-out overflow-x-hidden`}
        >
          <FaChevronLeft />
          <span>Prev</span>
        </button>
        <div className='flex-grow text-center text-black dark:text-neon-white font-extrabold lg:text-xl flex flex-row gap-2 justify-center'>
          {currentDate.format('dddd, MMM Do YYYY')}
          {!currentDate.isSame(moment(), 'day') && (
            <button
              data-style='none'
              className='underline text-red dark:text-neon-red-light flex-grow-0'
              aria-label='Jump to today date'
              onClick={() => {
                setCurrentDate(moment());
              }}
            >
              Jump To Today
            </button>
          )}
        </div>
        <button
          disabled={isNextDayDisabled}
          data-style='none'
          onClick={onNextDate}
          aria-label='Go to next day'
          className={`bg-black dark:bg-neon-white text-white dark:text-neon-black rounded-full py-1 px-3 drop-shadow-lg flex flex-row gap-1 justify-center items-center hover:opacity-50 transition-all ease-in-out overflow-x-hidden`}
        >
          <span>Next</span>
          <FaChevronRight />
        </button>
      </section>
    );
  };

  return (
    <section className='flex justify-center h-full'>
      <LoadingMask
        key='loading-mask'
        isLoading={isLoading}
        message='Fetching the Wall of Fame'
      />
      <h1 className='fixed top-0 h-20 py-4 text-center z-50'>
        Daily Wall of Fame
      </h1>
      <section className='pt-12 px-4 lg:px-20 lg:pt-20 pb-8 h-full w-full flex flex-col gap-4 overflow-y-hidden scrollbar-hide'>
        {currentDayLevel && (
          <div className='h-6 text-center flex justify-center items-center mt-4'>
            <span>Day Topic: {currentDayLevel.topic}</span>
          </div>
        )}
        {isMobile ? renderMobileDateSelector() : renderDesktopSelector()}
        <div id='leaderboard-table' className='relative w-full h-full'>
          <div className='!absolute w-full h-full -z-10 !rounded-none scale-95 color-gradient-animated-background-golden'></div>
          {leaderboardData.length > 0 ? (
            <section className='absolute w-full h-full z-10 px-2 py-4 bg-white dark:bg-neon-gray rounded-2xl justify-center text-sm overflow-y-scroll scrollbar-hide'>
              {leaderboardData.map((data, idx) => (
                <div
                  key={idx}
                  className={`${
                    data.rank === 1
                      ? 'border-4 border-yellow dark:border-neon-yellow box-border !h-[4.5rem]'
                      : 'border-none'
                  } ${
                    data.rank === myRank ? 'animate-pulse' : ''
                  } mt-4 mb-4 h-16 flex flex-row gap-2 px-2 py-2 rounded-full bg-black opacity-100 text-white dark:bg-neon-black dark:text-neon-white`}
                >
                  <div className='font-sans font-bold h-12 p-4 flex justify-center items-center rounded-full aspect-square bg-white-faded text-black dark:bg-neon-gray dark:text-neon-yellow text-lg'>
                    {data.rank}
                  </div>
                  <div className='self-center relative h-full'>
                    <div className='w-4'></div>
                    {data.rank === 1 ? (
                      <GiTrophy className='absolute bottom-1 -left-6 text-6xl text-yellow dark:text-neon-yellow drop-shadow-lg' />
                    ) : data.rank === 2 ? (
                      <GiTrophy className='absolute bottom-1 -left-5 text-5xl text-neon-silver drop-shadow-lg' />
                    ) : data.rank === 3 ? (
                      <GiTrophy className='absolute bottom-1 -left-5 text-4xl text-neon-bronze drop-shadow-lg' />
                    ) : (
                      <GiLaurelCrown className='absolute bottom-2 -left-5 text-4xl text-gray dark:text-neon-white-light drop-shadow-lg' />
                    )}
                  </div>
                  <div
                    className={`flex-grow self-center text-left ${
                      data.rank === 1
                        ? 'text-yellow dark:text-neon-yellow'
                        : 'dark:text-neon-white'
                    }`}
                  >
                    {data.nickname}
                  </div>
                  <div
                    className={`font-sans font-bold h-12 text-center p-4 w-24 lg:w-32 text-lg lg:text-xl flex justify-center items-center rounded-full text-black dark:bg-neon-gray  ${
                      data.rank === 1
                        ? 'bg-yellow dark:text-neon-yellow'
                        : 'bg-white-faded dark:text-neon-white'
                    }`}
                  >
                    {data.total_score}
                  </div>
                  {/* <button
                    data-style='none'
                    onClick={() => {
                      openDetails(data);
                    }}
                    aria-label={`See the detail score of ${data.nickname}`}
                    className='h-12 p-4 flex justify-center items-center rounded-full aspect-square bg-white-faded text-black border-2 border-yellow dark:border-neon-yellow drop-shadow-lg dark:bg-neon-gray dark:text-neon-yellow text-xl'
                  >
                    <MdLeaderboard />
                  </button> */}
                </div>
              ))}
            </section>
          ) : (
            <section className='absolute w-full bg-white dark:bg-neon-gray z-10 h-full flex-grow flex flex-col gap-4 p-2 rounded-2xl justify-center items-center text-2xl text-white-faded text-center'>
              <MdLeaderboard className='text-5xl' />
              <p>No data available for this day</p>
            </section>
          )}
        </div>
        {!myRank ? (
          <div className='w-full flex flex-col gap-2 justify-center items-center'>
            <span>You have no rank in the leaderboard.</span>
            {currentDate.isSame(moment(), 'day') && (
              <Link
                href='/daily-challenge/loading'
                data-style='none'
                className='h-12 font-bold rounded-full bg-yellow dark:bg-neon-yellow text-black dark:text-neon-black text-2xl px-4 py-2 drop-shadow-lg'
              >
                Try Today&apos;s Challenge
              </Link>
            )}
          </div>
        ) : (
          <div className='w-full flex justify-center items-center'>
            <span>
              You are ranked in <b>{getPosition(myRank)}</b> position!
            </span>
          </div>
        )}
      </section>
    </section>
  );
};

export default LeaderboardPage;
