'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SelectGroup } from '@radix-ui/react-select';
import { toLower, trim } from 'lodash';
import { Plus, RefreshCcw, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { generateTabooWordsFromAI } from '@/app/level/[id]/server/generate-taboo-words-from-ai';
import { FetchAllLevelsAndAuthorsReturnTypeSingle } from '@/app/x/review-words/server/fetch-levels';
import { RejectionReason, sendSecureEmail } from '@/app/x/review-words/server/send-email';
import { useAuth } from '@/components/auth-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { tryParseErrorAsGoogleAIError } from '@/lib/errors/google-ai-error-parser';
import {
  deleteLevel,
  updateLevelIsNew,
  updateLevelTargetWords,
  verifyLevel,
} from '@/lib/services/levelService';
import { addWord, fetchWord } from '@/lib/services/wordService';
import { IWord } from '@/lib/types/word.type';
import { cn } from '@/lib/utils';

type DevReviewWordsPageProps = {
  levels: FetchAllLevelsAndAuthorsReturnTypeSingle[];
  words: string[];
};
const DevReviewWordsPage = (props: DevReviewWordsPageProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<FetchAllLevelsAndAuthorsReturnTypeSingle>();
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [taboos, setTabooWords] = useState<IWord>();
  const [fullWordList, setFullWordList] = useState<string[]>([]);
  const [currentEditingTabooWordIndex, setCurrentEditingTabooWordIndex] = useState<number>();
  const [currentEditingTargetWordIndex, setCurrentEditingTargetWordIndex] = useState<number>();
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('inappropriate-content');
  const [rejectConfirmationOpen, setRejectConfirmationOpen] = useState(false);
  const [isSendingVerifyingEmail, startVerifyingEmailTransition] = useTransition();
  const [isSendingRejectingEmail, startRejectingEmailTransition] = useTransition();

  const isPageInteractive = useMemo(() => {
    return !isLoading && !isAutoGenerating && selectedLevel && user;
  }, [isLoading, isAutoGenerating, selectedLevel, user]);

  const router = useRouter();

  useEffect(() => {
    const level = props.levels.find((level) => level.id === selectedLevelId);
    setSelectedLevel(level);
  }, [selectedLevelId]);

  const getCachedWordList = useCallback(async () => {
    if (selectedLevel) {
      for (const word of selectedLevel.words) {
        if (word.length <= 0 || fullWordList.includes(word)) {
          continue;
        }
        word.toLowerCase() === 'static character' &&
        console.log('checking word: ' + word, props.words.length);
        if (props.words.includes(word.toLowerCase())) {
          setFullWordList((wordList) => [...wordList, word]);
        }
      }
    }
  }, [selectedLevel, setFullWordList, props.words]);

  useEffect(() => {
    void getCachedWordList();
  }, [getCachedWordList]);

  const onLevelSelected = async (levelId: string) => {
    setTabooWords(undefined);
    setCurrentEditingTabooWordIndex(undefined);
    setCurrentEditingTargetWordIndex(undefined);
    setSelectedLevelId(levelId);
  };

  const getVariationsForWord = useCallback(
    async (word: string) => {
      if (word.length <= 0) {
        return;
      }
      try {
        const taboo = await fetchWord(word);
        if (taboo && taboo.taboos.length > 0) {
          setTabooWords(taboo);
          return taboo;
        } else {
          const taboo = await generateTabooWordsFromAI(word);
          setTabooWords(taboo);
          return taboo;
        }
      } catch (error) {
        try {
          const googleError = tryParseErrorAsGoogleAIError(error, 'taboos-generation');
          toast.error(googleError.message);
        } catch (error) {
          console.error(error);
          toast.error('Unable to get taboo words for: ' + `"${word}"`);
        }
      }
    },
    [setTabooWords],
  );

  const startEditWord = (idx: number) => {
    setCurrentEditingTabooWordIndex(idx);
  };

  const addNewWord = () => {
    if (taboos) {
      setCurrentEditingTabooWordIndex(taboos?.taboos.length);
      const currentVariations = taboos.taboos;
      currentVariations.push('');
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const deleteWord = (idx: number) => {
    if (currentEditingTabooWordIndex === idx) {
      setCurrentEditingTabooWordIndex(-1);
    }
    if (taboos) {
      const currentVariations = taboos.taboos;
      currentVariations.splice(idx, 1);
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const refreshWord = async (word: string) => {
    const variations = await generateTabooWordsFromAI(word);
    setTabooWords(variations);
  };

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const currentVariations = taboos?.taboos;
    if (currentVariations && currentEditingTabooWordIndex !== undefined) {
      currentVariations[currentEditingTabooWordIndex] = e.target.value;
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const onVerifyTargetWord = (checked: boolean) => {
    if (taboos) {
      const currentTarget: IWord = { ...taboos };
      currentTarget.is_verified = checked;
      setTabooWords(currentTarget);
    }
  };

  const onEditTargetWord = (e: ChangeEvent<HTMLInputElement>) => {
    if (currentEditingTargetWordIndex !== undefined && selectedLevel) {
      const copyLevel = { ...selectedLevel };
      copyLevel.words[currentEditingTargetWordIndex] = e.target.value;
      setSelectedLevel(copyLevel);
    }
    if (taboos) {
      const copyTaboos: IWord = { ...taboos };
      copyTaboos.word = e.target.value;
      setTabooWords(copyTaboos);
    }
  };

  const onSave = async () => {
    if (taboos) {
      try {
        await addWord(
          taboos.word,
          taboos.taboos.map((w) => trim(toLower(w))),
          taboos.is_verified,
          user?.id,
        );
        selectedLevel && (await updateLevelTargetWords(selectedLevel.id, selectedLevel.words));
        setFullWordList((wordList) => [...wordList, trim(toLower(taboos.word))]);
        toast.success('Saved successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to save: ' + error.message);
      }
    } else {
      toast.info('No target word or variations available!');
    }
  };

  const generateForAll = async () => {
    const words = selectedLevel?.words;
    setIsAutoGenerating(true);
    if (words) {
      for (let i = 0; i < words.length; i++) {
        setCurrentEditingTargetWordIndex(i);
        try {
          await autoGenerateWithDelay(1000, words[i]);
        } catch {
          toast.error('Failed to generate for: ' + words[i]);
        }
      }
    }
    setIsAutoGenerating(false);
  };

  const autoGenerateWithDelay = async (delay: number, target: string): Promise<void> => {
    return new Promise((res, rej) => {
      setTimeout(async () => {
        try {
          const taboo = await fetchWord(target);
          if (taboo?.taboos.length ?? 0 > 0) {
            res();
          } else {
            const word = await generateTabooWordsFromAI(target);
            if (target && word) {
              await addWord(
                target,
                word.taboos.map((w) => trim(toLower(w))),
                false,
                user?.id,
              );
              setFullWordList((wordList) => [...wordList, target]);
              toast.success('Saved successfully!');
            } else {
              toast.info('No target word or variations available!');
            }
            res();
          }
        } catch (err) {
          console.error(err);
          rej();
        }
      }, delay);
    });
  };

  const deleteTargetWord = async (index: number) => {
    if (!selectedLevel) return;
    const copyLevel = { ...selectedLevel };
    copyLevel.words.splice(index);
    const newTarget = copyLevel.words[copyLevel.words.length - 1];
    await getVariationsForWord(newTarget);
    setCurrentEditingTabooWordIndex(copyLevel.words.length - 1);
    setSelectedLevel(copyLevel);
  };

  const addNewTargetWord = () => {
    if (!selectedLevel) {
      return;
    }
    const copyLevel = { ...selectedLevel };
    copyLevel.words.push('');
    setSelectedLevel(copyLevel);
  };

  const rejectLevel = async () => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        await deleteLevel(selectedLevel.id);
        setSelectedLevelId('');
        setCurrentEditingTargetWordIndex(undefined);
        setCurrentEditingTabooWordIndex(undefined);
        setTabooWords(undefined);
        toast.success('Level deleted successfully!');
        startRejectingEmailTransition(async () => {
          if (selectedLevel.author?.email) {
            try {
              await sendSecureEmail(
                selectedLevel.name ?? 'unknown',
                selectedLevel.author.email,
                'reject',
                rejectionReason,
              );
              toast.success('Verification rejection email sent successfully!');
            } catch (error) {
              console.error(error);
              toast.error('Failed to send verification rejection email: ' + error.message);
            }
          }
        });
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(`Unable to reject level: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Unable to reject level as no level is selected!');
    }
  };

  const resendVerifyEmail = async (
    level: FetchAllLevelsAndAuthorsReturnTypeSingle | undefined = undefined,
  ) => {
    if (!level) {
      toast.error('Unable to resend verification email as no level is selected!');
      return;
    }
    startVerifyingEmailTransition(async () => {
      if (level.author?.email) {
        try {
          await sendSecureEmail(level.name, level.author.email, 'verify', undefined);
          toast.success('Verification success email sent successfully!');
        } catch (error) {
          console.error(error);
          toast.error('Failed to send verification success email: ' + error.message);
        }
      }
    });
  };

  const setVerifyLevel = async () => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        const copyLevel = { ...selectedLevel };
        copyLevel.is_verified = true;
        await verifyLevel(copyLevel.id);
        toast.success('Level verified successfully!');
        await resendVerifyEmail(copyLevel);
        setSelectedLevel(copyLevel);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(`Unable to verify level: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Unable to verify level as no level is selected!');
    }
  };

  const setLevelIsNew = async (isNew: boolean) => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        const copyLevel = { ...selectedLevel };
        copyLevel.is_new = isNew;
        await updateLevelIsNew(copyLevel.id, isNew);
        toast.success('Level updated successfully!');
        setSelectedLevel(copyLevel);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(`Unable to update level: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user || !user.is_dev) {
    return <section className="flex h-full w-full items-center justify-center"></section>;
  }

  return (
    <main className="flex flex-col items-center gap-4 py-4 leading-snug">
      {selectedLevel && (
        <>
          <div className="flex flex-wrap justify-center gap-2 p-2">
            <Badge variant={selectedLevel?.is_verified ? 'default' : 'destructive'}>
              {selectedLevel?.is_verified ? 'Verified' : 'Not Verified'}
            </Badge>
            <Badge>
              {selectedLevel.author?.nickname || selectedLevel.author?.name
                ? `by: ${selectedLevel.author.nickname ?? selectedLevel.author.name}`
                : 'No Author'}
            </Badge>
            <Badge>Difficulty: {selectedLevel?.difficulty}</Badge>
            {selectedLevel?.is_new && <Badge>NEW</Badge>}
          </div>
          {selectedLevel.author && (
            <div className="flex flex-wrap justify-center gap-2 p-2">
              <div>From: {selectedLevel.author.email}</div>
            </div>
          )}
        </>
      )}
      <div className="w-full px-8">
        <Select name="level" value={selectedLevel?.name} onValueChange={onLevelSelected}>
          <SelectTrigger>
            <SelectValue placeholder="Select A Topic to Review" className="text-primary">
              <b>{selectedLevel?.name}</b>
              {(selectedLevel?.author?.nickname || selectedLevel?.author?.name) && (
                <span>
                  {' - '}
                  {selectedLevel?.author.name ?? selectedLevel?.author.nickname}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            className="max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]">
            {props.levels.map((level, idx) => (
              <SelectItem key={idx} value={level.id}>
                <b>{level?.name}</b>
                {(level?.author?.nickname || level?.author?.name) && (
                  <span>
                    {' - '}
                    {level?.author.name ?? level?.author.nickname}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full px-8">
        <Input
          className="h-full w-full"
          value={
            currentEditingTargetWordIndex !== undefined
              ? selectedLevel?.words[currentEditingTargetWordIndex]
              : ''
          }
          onChange={onEditTargetWord}
          disabled={
            !selectedLevel || currentEditingTargetWordIndex === undefined || !isPageInteractive
          }
          placeholder="Pick a word to edit..."
          type="text"
        />
      </div>
      <div className="flex min-h-[200px] w-10/12 flex-wrap gap-4 overflow-y-auto rounded-lg p-8 shadow-lg">
        {selectedLevel?.words.map((word, idx) => (
          <div key={idx} className="relative w-auto">
            <Button
              disabled={!isPageInteractive}
              className={cn(
                fullWordList.map((w) => trim(toLower(w))).includes(trim(toLower(word)))
                  ? '!bg-green-500 !text-black'
                  : '!bg-yellow-500 !text-black',
                currentEditingTargetWordIndex === idx ? '!border-1 !border-white' : '',
              )}
              key={idx}
              onClick={() => {
                setCurrentEditingTargetWordIndex(idx);
                void getVariationsForWord(word);
              }}
            >
              {word}
            </Button>
            {currentEditingTargetWordIndex === idx && (
              <>
                <IconButton
                  asChild
                  tooltip="Ask AI for Taboo Words again"
                  aria-label="refresh"
                  disabled={!isPageInteractive}
                  className="absolute -left-4 -top-5 rounded-full bg-yellow-500"
                  id="refresh"
                  data-style="none"
                  onClick={() => {
                    void refreshWord(word);
                  }}
                >
                  <RefreshCcw size={15} color="black" />
                </IconButton>
                <IconButton
                  asChild
                  tooltip="Delete"
                  aria-label="delete"
                  disabled={!isPageInteractive}
                  className="absolute -right-3 -top-5 rounded-full"
                  variant="destructive"
                  id="delete"
                  onClick={() => {
                    void deleteTargetWord(idx);
                  }}
                >
                  <Trash size={15} />
                </IconButton>
              </>
            )}
          </div>
        ))}
        <IconButton
          asChild
          tooltip="Add target word"
          disabled={
            !isPageInteractive ||
            !selectedLevel ||
            (selectedLevel && selectedLevel.words[selectedLevel.words.length - 1].length <= 0)
          }
          onClick={addNewTargetWord}
        >
          <Plus />
        </IconButton>
      </div>
      <Separator />
      <div className="flex w-10/12 flex-wrap gap-4">
        {taboos?.taboos.map((word, idx) => (
          <div key={idx} className="relative w-auto">
            <Button
              disabled={!isPageInteractive}
              variant="outline"
              className={cn(
                currentEditingTabooWordIndex === idx ? 'border-2 border-yellow-500' : '',
              )}
              onClick={() => {
                startEditWord(idx);
              }}
            >
              {word}
            </Button>
            <IconButton
              asChild
              tooltip="Delete"
              aria-label="delete"
              disabled={!isPageInteractive}
              className="absolute -right-3 -top-4 rounded-full"
              id="delete"
              variant="destructive"
              onClick={() => {
                deleteWord(idx);
              }}
            >
              <Trash size={15} />
            </IconButton>
          </div>
        ))}
      </div>
      <div className="flex w-full flex-row items-center gap-2 px-2">
        <Input
          disabled={
            (taboos?.taboos.length ?? 0) <= 0 ||
            (currentEditingTabooWordIndex && currentEditingTabooWordIndex < 0) ||
            !isPageInteractive
          }
          placeholder="Pick a word to edit..."
          type="text"
          onChange={onEdit}
          value={
            currentEditingTabooWordIndex !== undefined
              ? taboos?.taboos[currentEditingTabooWordIndex]
              : ''
          }
          className="h-12 grow text-xl"
        />
        <IconButton
          asChild
          tooltip="Add taboo word"
          aria-label="add word"
          disabled={
            !isPageInteractive ||
            currentEditingTargetWordIndex === undefined ||
            currentEditingTargetWordIndex < 0 ||
            !taboos?.taboos.every((s) => s.length > 0)
          }
          className="rounded-full drop-shadow-lg"
          id="add"
          data-style="none"
          onClick={addNewWord}
        >
          <Plus />
        </IconButton>
      </div>
      {(taboos?.taboos.length ?? 0) > 0 && isPageInteractive && (
        <div>
          Verified: <Switch checked={taboos?.is_verified} onCheckedChange={onVerifyTargetWord} />
        </div>
      )}
      <Separator />
      <div className="grid w-10/12 grid-cols-2 gap-4">
        <Button
          disabled={
            !isPageInteractive ||
            !selectedLevel?.words.every((s) => s.length > 0) ||
            !taboos?.taboos.every((s) => s.length > 0)
          }
          className="flex-grow bg-green-500 text-black"
          onClick={onSave}
        >
          SAVE
        </Button>
        <Button
          disabled={!isPageInteractive || !selectedLevel?.words.every((s) => s.length > 0)}
          className="flex-grow bg-yellow-500 text-black"
          onClick={generateForAll}
        >
          AUTO GENERATE
        </Button>
        <Button
          disabled={!isPageInteractive}
          className="flex-grow"
          onClick={() => {
            void setLevelIsNew(true);
          }}
        >
          SET IS NEW
        </Button>
        <Button
          disabled={!isPageInteractive}
          className="flex-grow"
          onClick={() => {
            void setLevelIsNew(false);
          }}
          variant="destructive"
        >
          SET NOT NEW
        </Button>
        {!selectedLevel?.is_verified ? (
          <Button
            disabled={!isPageInteractive || isSendingVerifyingEmail}
            className="flex-grow"
            onClick={setVerifyLevel}
          >
            VERIFY
          </Button>
        ) : (
          <Button
            disabled={!isPageInteractive || isSendingVerifyingEmail}
            className="flex-grow"
            onClick={() => {
              void resendVerifyEmail(selectedLevel);
            }}
          >
            Resend Verify Email
          </Button>
        )}
        <Button
          disabled={!isPageInteractive || isSendingRejectingEmail}
          className="flex-grow"
          onClick={() => {
            setRejectConfirmationOpen(true);
          }}
          variant="destructive"
        >
          REJECT
        </Button>
      </div>
      <div className="mt-2 flex w-full flex-row items-center gap-2 px-8">
        <Label htmlFor="reject-reason-select">Rejection Reason</Label>
        <Select
          value={rejectionReason}
          onValueChange={(value: RejectionReason) => {
            setRejectionReason(value);
          }}
        >
          <SelectTrigger id="reject-reason-select">
            <SelectValue placeholder="Choose a rejection reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rejection Reasons</SelectLabel>
              <SelectItem value="inappropriate-content">Inappropriate Content</SelectItem>
              <SelectItem value="ambiguous">Ambiguity and Lack of Clarity</SelectItem>
              <SelectItem value="duplicate">Duplicate Topic</SelectItem>
              <SelectItem value="insufficient-word-variety">Insufficient Word Variety</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <AlertDialog
        open={rejectConfirmationOpen}
        onOpenChange={(open) => setRejectConfirmationOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to reject this entry?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction onClick={rejectLevel}>Proceed to reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default DevReviewWordsPage;
