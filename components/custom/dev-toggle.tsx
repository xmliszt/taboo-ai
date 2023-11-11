'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRandomInt } from '@/lib/utilities';
import { CONSTANTS } from '@/lib/constants';
import { useAuth } from '@/components/auth-provider';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import IconButton from '../ui/icon-button';
import { Bot } from 'lucide-react';
import { AdminManager } from '@/lib/admin-manager';
import { IScore } from '@/lib/types/score.type';
import {
  clearDevMode,
  getDevMode,
  isDevMode,
  setDevMode,
  setDevModeOff,
  setDevModeOn,
} from '@/lib/utils/devUtils';
import IGame from '@/lib/types/game.type';
import {
  aggregateTotalScore,
  aggregateTotalTimeTaken,
} from '@/lib/utils/gameUtils';
import { getHash, HASH } from '@/lib/hash';
import { getPersistence, setPersistence } from '@/lib/persistence/persistence';
import ILevel from '@/lib/types/level.type';

const DevToggle = () => {
  const [devOn, setDevOn] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<number>(1);
  const { user, status } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (status === 'authenticated' && AdminManager.checkIsAdmin(user)) {
      setDevOn(isDevMode());
      const mode = getDevMode();
      if (mode) {
        setSelectedMode(Number(mode));
      } else {
        setSelectedMode(1);
        setDevMode('1');
      }
    } else {
      clearDevMode();
    }
  }, [user, status]);

  const onDevToggle = (isChecked: boolean) => {
    if (isChecked) {
      setDevModeOn();
    } else {
      setDevModeOff();
    }
    setDevOn(isChecked);
  };

  const onModeChange = (mode: number) => {
    setSelectedMode(mode);
    setDevMode(mode.toString());
  };

  const autoCompleteLevel = () => {
    const level = getPersistence<ILevel>(HASH.level);
    if (level) {
      const savedScores: IScore[] = [];
      for (let i = 1; i <= CONSTANTS.numberOfQuestionsPerGame; i++) {
        const target = level.words[i - 1];
        savedScores.push({
          id: i,
          target: target,
          conversation: [
            { role: 'user', content: 'Sample user input: ' + target },
            { role: 'assistant', content: 'Sample response: ' + target },
          ],
          difficulty: level.difficulty,
          completion: getRandomInt(1, 100),
          responseHighlights: [
            {
              start: 17,
              end: 17 + target.length,
            },
          ],
        });
      }
      // Create IGame object
      const completedAt = new Date();
      const game: IGame = {
        id: getHash(`admin-${level.id}-${completedAt.toISOString()}`),
        levelId: level.id,
        totalScore: aggregateTotalScore(savedScores),
        totalDuration: aggregateTotalTimeTaken(savedScores),
        difficulty: level.difficulty,
        finishedAt: completedAt,
        scores: savedScores,
      };
      setPersistence(HASH.game, game);
    }
    router.push('/result');
  };

  return status === 'authenticated' && AdminManager.checkIsAdmin(user) ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton tooltip='Open Dev Menu'>
          <Bot />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='flex flex-col gap-2 justify-center p-2'>
        <div className='flex flex-row gap-2 w-full justify-center items-center'>
          <Switch
            id='dev-toggle'
            aria-label='Toggle for development mode'
            name='dev-toggle'
            checked={devOn}
            onCheckedChange={onDevToggle}
          />
          <label htmlFor='dev-toggle'>Dev Mode</label>
        </div>
        {devOn && (
          <>
            <fieldset
              id='response-mode'
              className='w-full p-4 bg-card border-[1px] border-primary text-primary leading-none rounded-lg'
            >
              <h2 className='mb-4 font-bold'>Server Response Mode</h2>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-row gap-2 items-center'>
                  <Checkbox
                    id='response-success'
                    aria-label='Toggle for response success mode'
                    name='response-success'
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(1);
                      }
                    }}
                    checked={selectedMode === 1}
                    value='1'
                  />
                  <label htmlFor='response-success'>success</label>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <Checkbox
                    id='response-nomatch'
                    aria-label='Toggle for response no match mode'
                    name='response-nomatch'
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(2);
                      }
                    }}
                    checked={selectedMode === 2}
                    value='2'
                  />
                  <label htmlFor='response-nomatch'>no-match</label>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <Checkbox
                    id='response-overload'
                    aria-label='Toggle for overloaded mode'
                    name='response-overload'
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(3);
                      }
                    }}
                    checked={selectedMode === 3}
                    value='3'
                  />
                  <label htmlFor='response-overload'>overloaded</label>
                </div>
                <div className='flex flex-row gap-2 items-center'>
                  <Checkbox
                    id='response-error'
                    aria-label='Toggle for server error mode'
                    name='response-error'
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(4);
                      }
                    }}
                    checked={selectedMode === 4}
                    value='4'
                  />
                  <label htmlFor='response-error'>error</label>
                </div>
              </div>
            </fieldset>
            <Button
              disabled={!/^\/level\/.+$/.test(path ?? '')}
              onClick={autoCompleteLevel}
            >
              auto complete
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <></>
  );
};

export default DevToggle;
