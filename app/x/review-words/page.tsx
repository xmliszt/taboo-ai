'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SelectGroup } from '@radix-ui/react-select';
import _ from 'lodash';
import { Plus, RefreshCcw, Trash } from 'lucide-react';

import { RejectionReason } from '@/app/api/x/mail/route';
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
import { useToast } from '@/components/ui/use-toast';
import { firebaseAuth } from '@/firebase/firebase-client';
import { AdminManager } from '@/lib/admin-manager';
import { useLevels } from '@/lib/hooks/useLevels';
import { askAITabooWordsForTarget } from '@/lib/services/aiService';
import { sendEmailX } from '@/lib/services/emailService';
import {
  deleteLevel,
  updateLevelIsNew,
  updateLevelTargetWords,
  verifyLevel,
} from '@/lib/services/levelService';
import { addTabooWords, getTabooWords, isTargetWordExists } from '@/lib/services/wordService';
import ILevel from '@/lib/types/level.type';
import IWord from '@/lib/types/word.type';
import { cn } from '@/lib/utils';
import { LevelUtils } from '@/lib/utils/levelUtils';

const DevReviewWordsPage = () => {
  const { user, status } = useAuth();
  const { levels, isFetchingLevels, refetch } = useLevels();
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ILevel | undefined>();
  const [selectedLevelId, setSelectedLevelId] = useState('');
  const [taboos, setTabooWords] = useState<IWord>();
  const [fullWordList, setFullWordList] = useState<string[]>([]);
  const [currentEditingTabooWordIndex, setCurrentEditingTabooWordIndex] = useState<number>();
  const [currentEditingTargetWordIndex, setCurrentEditingTargetWordIndex] = useState<number>();
  const [sortedLevels, setSortedLevels] = useState<ILevel[]>([]);
  const [rejectionReason, setRejectionReason] = useState<RejectionReason>('inapproriate-content');
  const [rejectConfirmationOpen, setRejectConfirmationOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const copyLevels = [...levels];
    copyLevels.sort(LevelUtils.getCompareFn('create-new'));
    setSortedLevels(copyLevels);
  }, [levels]);

  const isPageInteractive = useMemo(() => {
    return (
      !isFetchingLevels &&
      !isLoading &&
      !isAutoGenerating &&
      selectedLevel &&
      sortedLevels &&
      user &&
      status === 'authenticated'
    );
  }, [isFetchingLevels, isLoading, isAutoGenerating, selectedLevel, sortedLevels, user, status]);

  const router = useRouter();

  useEffect(() => {
    const level = levels.find((level) => level.id === selectedLevelId);
    setSelectedLevel(level);
  }, [selectedLevelId]);

  useEffect(() => {
    if (status === 'unauthenticated' || !AdminManager.checkIsAdmin(user)) {
      toast({
        title: 'You are not authorized to view this page!',
        variant: 'destructive',
      });
      router.push('/');
    }
  }, [user, status]);

  const getCachedWordList = useCallback(async () => {
    selectedLevel?.words.forEach(async (word) => {
      if (word.length <= 0 || fullWordList.includes(word)) {
        return;
      }
      const exists = await isTargetWordExists(word);
      if (exists) {
        setFullWordList((wordList) => [...wordList, word]);
      }
    });
  }, [selectedLevel, setFullWordList]);

  useEffect(() => {
    getCachedWordList();
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
        const taboo = await getTabooWords(word);
        if (taboo && taboo.taboos.length > 0) {
          setTabooWords(taboo);
          return taboo;
        } else {
          const taboo = await askAITabooWordsForTarget(word);
          setTabooWords(taboo);
          return taboo;
        }
      } catch (error) {
        console.error(error);
        toast({
          title: 'Unable to get taboo words for: ' + `"${word}"`,
          variant: 'destructive',
        });
      }
    },
    [setTabooWords]
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
    const variations = await askAITabooWordsForTarget(word);
    setTabooWords(variations);
  };

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const currentVariations = taboos?.taboos;
    if (currentVariations && currentEditingTabooWordIndex) {
      currentVariations[currentEditingTabooWordIndex] = e.target.value;
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const onVerifyTargetWord = (checked: boolean) => {
    if (taboos) {
      const currentTarget: IWord = { ...taboos };
      currentTarget.isVerified = checked;
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
      copyTaboos.target = e.target.value;
      setTabooWords(copyTaboos);
    }
  };

  const onSave = async () => {
    if (taboos) {
      await addTabooWords(
        taboos.target,
        taboos.taboos.map((w) => _.trim(_.toLower(w))),
        taboos.isVerified,
        user?.email
      );
      selectedLevel && (await updateLevelTargetWords(selectedLevel.id, selectedLevel.words));
      setFullWordList((wordList) => [...wordList, _.trim(_.toLower(taboos.target))]);
      toast({ title: 'Saved successfully!' });
    } else {
      toast({
        title: 'No target word or variations available!',
      });
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
          continue;
        }
      }
    }
    setIsAutoGenerating(false);
  };

  const autoGenerateWithDelay = async (delay: number, target: string): Promise<void> => {
    return new Promise((res, rej) => {
      setTimeout(async () => {
        try {
          const taboo = await getTabooWords(target);
          if (taboo?.taboos.length ?? 0 > 0) {
            res();
          } else {
            const taboos = await askAITabooWordsForTarget(target);
            if (target && taboos) {
              await addTabooWords(
                target,
                taboos.taboos.map((w) => _.trim(_.toLower(w))),
                false,
                user?.email
              );
              setFullWordList((wordList) => [...wordList, target]);
              toast({ title: 'Saved successfully!' });
            } else {
              toast({
                title: 'No target word or variations available!',
              });
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

  const deleteTargetWord = (index: number) => {
    if (!selectedLevel) {
      return;
    }
    const copyLevel = { ...selectedLevel };
    copyLevel.words.splice(index);
    const newTarget = copyLevel.words[copyLevel.words.length - 1];
    getVariationsForWord(newTarget);
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
        toast({ title: 'Level deleted successfully!' });
        if (selectedLevel.authorEmail) {
          try {
            const token = await firebaseAuth.currentUser?.getIdToken();
            await sendEmailX(
              selectedLevel.name ?? 'unknown',
              selectedLevel.authorEmail,
              'reject',
              rejectionReason,
              token
            );
            toast({ title: 'Verification rejection email sent successfully!' });
          } catch (error) {
            console.error(error);
            toast({
              title: 'Failed to send verification rejection email: ' + error.message,
              variant: 'destructive',
            });
          }
        }
        await refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: `Unable to reject level: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: 'Unable to reject level as no level is selected!',
        variant: 'destructive',
      });
    }
  };

  const resendVerifyEmail = async (level: ILevel | undefined = undefined) => {
    const copyLevel = level ?? { ...selectedLevel };
    if (copyLevel.authorEmail) {
      try {
        const token = await firebaseAuth.currentUser?.getIdToken();
        await sendEmailX(
          copyLevel.name ?? 'unknown',
          copyLevel.authorEmail,
          'verify',
          undefined,
          token
        );
        toast({ title: 'Verification success email sent successfully!' });
      } catch (error) {
        console.error(error);
        toast({
          title: 'Failed to send verification success email: ' + error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const setVerifyLevel = async () => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        const copyLevel = { ...selectedLevel };
        copyLevel.isVerified = true;
        await verifyLevel(copyLevel.id);
        toast({ title: 'Level verified successfully!' });
        resendVerifyEmail(copyLevel);
        setSelectedLevel(copyLevel);
        await refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: `Unable to verify level: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: 'Unable to verify level as no level is selected!',
        variant: 'destructive',
      });
    }
  };

  const setLevelIsNew = async (isNew: boolean) => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        const copyLevel = { ...selectedLevel };
        copyLevel.isNew = isNew;
        await updateLevelIsNew(copyLevel.id, isNew);
        toast({ title: 'Level updated successfully!' });
        setSelectedLevel(copyLevel);
        await refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: `Unable to update level: ${error.message}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user || status !== 'authenticated' || !AdminManager.checkIsAdmin(user)) {
    return <section className='flex h-full w-full items-center justify-center'></section>;
  }

  return (
    <main className='flex flex-col items-center justify-center gap-4 py-20 leading-snug'>
      <div className='flex flex-wrap justify-center gap-2 p-2'>
        <Badge variant={selectedLevel?.isVerified ? 'default' : 'destructive'}>
          {selectedLevel?.isVerified ? 'Verified' : 'Not Verified'}
        </Badge>
        <Badge>{selectedLevel?.author ? `by: ${selectedLevel.author}` : 'No Author'}</Badge>
        <Badge>Difficulty: {selectedLevel?.difficulty}</Badge>
        {selectedLevel?.isNew && <Badge>NEW</Badge>}
      </div>
      <div className='flex flex-wrap justify-center gap-2 p-2'>
        <div>From: {selectedLevel?.authorEmail}</div>
      </div>
      <div className='w-full px-8'>
        <Select name='level' value={selectedLevel?.name} onValueChange={onLevelSelected}>
          <SelectTrigger>
            <SelectValue placeholder='Select A Topic to Review' className='text-primary'>
              <b>{selectedLevel?.name}</b>
              {selectedLevel?.author && (
                <span>
                  {' - '}
                  {selectedLevel.author}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className='max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]'>
            {sortedLevels.map((level, idx) => (
              <SelectItem key={idx} value={level.id}>
                <b>{level?.name}</b>
                {level?.author && (
                  <span>
                    {' - '}
                    {level.author}
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='w-full px-8'>
        <Input
          className='h-full w-full'
          value={
            currentEditingTargetWordIndex !== undefined
              ? selectedLevel?.words[currentEditingTargetWordIndex]
              : ''
          }
          onChange={onEditTargetWord}
          disabled={
            selectedLevel === null ||
            currentEditingTargetWordIndex === undefined ||
            !isPageInteractive
          }
          placeholder='Pick a word to edit...'
          type='text'
        />
      </div>
      <div className='flex max-h-52 w-10/12 flex-wrap gap-4 overflow-y-auto rounded-lg p-8 shadow-lg'>
        {selectedLevel?.words.map((word, idx) => (
          <div key={idx} className='relative w-auto'>
            <Button
              disabled={!isPageInteractive}
              className={cn(
                fullWordList.map((w) => _.trim(_.toLower(w))).includes(_.trim(_.toLower(word)))
                  ? '!bg-green-500 !text-black'
                  : '!bg-yellow-500 !text-black',
                currentEditingTargetWordIndex === idx ? '!border-1 !border-white' : ''
              )}
              key={idx}
              onClick={() => {
                setCurrentEditingTargetWordIndex(idx);
                getVariationsForWord(word);
              }}
            >
              {word}
            </Button>
            {currentEditingTargetWordIndex === idx && (
              <>
                <IconButton
                  asChild
                  tooltip='Ask AI for Taboo Words again'
                  aria-label='refresh'
                  disabled={!isPageInteractive}
                  className='absolute -left-4 -top-5 rounded-full bg-yellow-500'
                  id='refresh'
                  data-style='none'
                  onClick={() => {
                    refreshWord(word);
                  }}
                >
                  <RefreshCcw size={15} color='black' />
                </IconButton>
                <IconButton
                  asChild
                  tooltip='Delete'
                  aria-label='delete'
                  disabled={!isPageInteractive}
                  className='absolute -right-3 -top-5 rounded-full'
                  variant='destructive'
                  id='delete'
                  onClick={() => {
                    deleteTargetWord(idx);
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
          tooltip='Add target word'
          disabled={
            !isPageInteractive ||
            selectedLevel === null ||
            (selectedLevel && selectedLevel.words[selectedLevel.words.length - 1].length <= 0)
          }
          onClick={addNewTargetWord}
        >
          <Plus />
        </IconButton>
      </div>
      <Separator />
      <div className='flex w-10/12 flex-wrap gap-4'>
        {taboos?.taboos.map((word, idx) => (
          <div key={idx} className='relative w-auto'>
            <Button
              disabled={!isPageInteractive}
              variant='outline'
              className={cn(
                currentEditingTabooWordIndex === idx ? 'border-2 border-yellow-500' : ''
              )}
              onClick={() => {
                startEditWord(idx);
              }}
            >
              {word}
            </Button>
            <IconButton
              asChild
              tooltip='Delete'
              aria-label='delete'
              disabled={!isPageInteractive}
              className='absolute -right-3 -top-4 rounded-full'
              id='delete'
              variant='destructive'
              onClick={() => {
                deleteWord(idx);
              }}
            >
              <Trash size={15} />
            </IconButton>
          </div>
        ))}
      </div>
      <div className='flex w-full flex-row items-center gap-2 px-2'>
        <Input
          disabled={
            (taboos?.taboos.length ?? 0) <= 0 ||
            (currentEditingTabooWordIndex && currentEditingTabooWordIndex < 0) ||
            !isPageInteractive
          }
          placeholder='Pick a word to edit...'
          type='text'
          onChange={onEdit}
          value={
            currentEditingTabooWordIndex !== undefined
              ? taboos?.taboos[currentEditingTabooWordIndex]
              : ''
          }
          className='h-12 grow text-xl'
        />
        <IconButton
          asChild
          tooltip='Add taboo word'
          aria-label='add word'
          disabled={
            !isPageInteractive ||
            currentEditingTargetWordIndex === undefined ||
            currentEditingTargetWordIndex < 0 ||
            !taboos?.taboos.every((s) => s.length > 0)
          }
          className='rounded-full drop-shadow-lg'
          id='add'
          data-style='none'
          onClick={addNewWord}
        >
          <Plus />
        </IconButton>
      </div>
      {(taboos?.taboos.length ?? 0) > 0 && isPageInteractive && (
        <div>
          Verified: <Switch checked={taboos?.isVerified} onCheckedChange={onVerifyTargetWord} />
        </div>
      )}
      <Separator />
      <div className='grid w-10/12 grid-cols-2 gap-4'>
        <Button
          disabled={
            !isPageInteractive ||
            !selectedLevel?.words.every((s) => s.length > 0) ||
            !taboos?.taboos.every((s) => s.length > 0)
          }
          className='flex-grow bg-green-500 text-black'
          onClick={onSave}
        >
          SAVE
        </Button>
        <Button
          disabled={!isPageInteractive || !selectedLevel?.words.every((s) => s.length > 0)}
          className='flex-grow bg-yellow-500 text-black'
          onClick={generateForAll}
        >
          AUTO GENERATE
        </Button>
        <Button
          disabled={!isPageInteractive}
          className='flex-grow'
          onClick={() => {
            setLevelIsNew(true);
          }}
        >
          SET IS NEW
        </Button>
        <Button
          disabled={!isPageInteractive}
          className='flex-grow'
          onClick={() => {
            setLevelIsNew(false);
          }}
          variant='destructive'
        >
          SET NOT NEW
        </Button>
        {!selectedLevel?.isVerified ? (
          <Button disabled={!isPageInteractive} className='flex-grow' onClick={setVerifyLevel}>
            VERIFY
          </Button>
        ) : (
          <Button
            disabled={!isPageInteractive}
            className='flex-grow'
            onClick={() => {
              resendVerifyEmail();
            }}
          >
            Resend Verify Email
          </Button>
        )}
        <Button
          disabled={!isPageInteractive}
          className='flex-grow'
          onClick={() => {
            setRejectConfirmationOpen(true);
          }}
          variant='destructive'
        >
          REJECT
        </Button>
      </div>
      <div className='mt-2 flex w-full flex-row items-center gap-2 px-8'>
        <Label htmlFor='reject-reason-select'>Rejection Reason</Label>
        <Select
          value={rejectionReason}
          onValueChange={(value: RejectionReason) => {
            setRejectionReason(value);
          }}
        >
          <SelectTrigger id='reject-reason-select'>
            <SelectValue placeholder='Choose a rejection reason' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rejection Reasons</SelectLabel>
              <SelectItem value='inapproriate-content'>Inappropriate Content</SelectItem>
              <SelectItem value='ambiguous'>Ambiguity and Lack of Clarity</SelectItem>
              <SelectItem value='duplicate'>Duplicate Topic</SelectItem>
              <SelectItem value='insufficient-word-variety'>Insufficient Word Variety</SelectItem>
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
