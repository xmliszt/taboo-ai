'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';
import { toast } from 'sonner';

import { ScoreToUpload } from '@/app/level/[id]/server/upload-game';
import { useAuth } from '@/components/auth-provider';
import { CONSTANTS } from '@/lib/constants';
import { HASH } from '@/lib/hash';
import { getPersistence } from '@/lib/persistence/persistence';
import { LevelToUpload } from '@/lib/types/level.type';
import { getRandomInt } from '@/lib/utilities';
import {
  clearDevMode,
  getDevMode,
  isDevMode,
  setDevMode,
  setDevModeOff,
  setDevModeOn,
} from '@/lib/utils/devUtils';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import IconButton from '../ui/icon-button';
import { Switch } from '../ui/switch';

const DevToggle = () => {
  const [devOn, setDevOn] = useState<boolean>(false);
  const [selectedMode, setSelectedMode] = useState<number>(1);
  const { user } = useAuth();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (user && user?.is_dev) {
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
  }, [user]);

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
    const level = getPersistence<LevelToUpload>(HASH.level);
    if (level) {
      const savedScores: ScoreToUpload[] = [];
      for (let i = 1; i <= CONSTANTS.numberOfQuestionsPerGame; i++) {
        const target = level.words[i - 1];
        savedScores.push({
          score_index: i,
          duration: getRandomInt(1, 100),
          target_word: target,
          taboo_words: [target],
          highlights: [
            {
              start_position: 17,
              end_position: 17 + target.length,
            },
          ],
          conversations: [
            { role: 'user', content: 'Sample user input: ' + target, timestamp: new Date().toISOString() },
            {
              role: 'assistant',
              content: 'Sample response: ' + target,
              timestamp: new Date().toISOString(),
            },
          ],
          ai_evaluation: {
            ai_explanation: 'Sample AI evaluation',
            ai_score: getRandomInt(0, 100),
            ai_suggestion: [
              `What is something that is red and round?`,
              `This thing drops from a tree and hits you on the head`,
              `This thing is a fruit, and it is fragrant and yummy. Chef Gordon Ramsay loves it! What is it?`,
            ],
          },
        });
      }
      const resultPageSearchParam = new URLSearchParams();
      resultPageSearchParam.set('level', JSON.stringify(level));
      resultPageSearchParam.set('scores', JSON.stringify(savedScores));
      router.push(`/result?${resultPageSearchParam}`);
      return;
    } else {
      toast.error('No level found, cannot auto complete!');
    }
  };

  return user && user?.is_dev ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton tooltip="Open Dev Menu">
          <Bot />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col justify-center gap-2 p-2">
        <div className="flex w-full flex-row items-center justify-center gap-2">
          <Switch
            id="dev-toggle"
            aria-label="Toggle for development mode"
            name="dev-toggle"
            checked={devOn}
            onCheckedChange={onDevToggle}
          />
          <label htmlFor="dev-toggle">Dev Mode</label>
        </div>
        {devOn && (
          <>
            <fieldset
              id="response-mode"
              className="w-full rounded-lg border-[1px] border-primary bg-card p-4 leading-none text-primary"
            >
              <h2 className="mb-4 font-bold">Server Response Mode</h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="response-success"
                    aria-label="Toggle for response success mode"
                    name="response-success"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(1);
                      }
                    }}
                    checked={selectedMode === 1}
                    value="1"
                  />
                  <label htmlFor="response-success">success</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="response-nomatch"
                    aria-label="Toggle for response no match mode"
                    name="response-nomatch"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(2);
                      }
                    }}
                    checked={selectedMode === 2}
                    value="2"
                  />
                  <label htmlFor="response-nomatch">no-match</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="response-overload"
                    aria-label="Toggle for overloaded mode"
                    name="response-overload"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(3);
                      }
                    }}
                    checked={selectedMode === 3}
                    value="3"
                  />
                  <label htmlFor="response-overload">overloaded</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <Checkbox
                    id="response-error"
                    aria-label="Toggle for server error mode"
                    name="response-error"
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onModeChange(4);
                      }
                    }}
                    checked={selectedMode === 4}
                    value="4"
                  />
                  <label htmlFor="response-error">error</label>
                </div>
              </div>
            </fieldset>
            <Button disabled={!/^\/level\/.+$/.test(path ?? '')} onClick={autoCompleteLevel}>
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
