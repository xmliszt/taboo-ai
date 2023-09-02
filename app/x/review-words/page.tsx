'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { IoMdAddCircle, IoMdRefreshCircle } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';
import _ from 'lodash';
import { BiMinusCircle, BiPlusCircle } from 'react-icons/bi';
import ILevel from '@/lib/types/level.interface';
import IWord from '@/lib/types/word.interface';
import { useLevels } from '@/lib/hooks/useLevels';
import { addTabooWords, getTabooWords } from '@/lib/services/wordService';
import { askAITabooWordsForTarget } from '@/lib/services/aiService';
import useToast from '@/lib/hooks/useToast';
import {
  deleteLevel,
  updateLevel,
  verifyLevel,
} from '@/lib/services/levelService';
import { Button, IconButton, Input, Select } from '@chakra-ui/react';
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';

const DevReviewWordsPage = () => {
  const { user, status } = useAuth();
  const { levels, isFetchingLevels, refetch } = useLevels();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<ILevel | null>(null);
  const [taboos, setTabooWords] = useState<IWord>();
  const [editText, setEditText] = useState<string>();
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(-1);
  const [currentTarget, setCurrentTarget] = useState<string>();
  const [fullWordList, setFullWordList] = useState<string[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [currentEditingTargetWordIndex, setCurrentEditingTargetWordIndex] =
    useState<number>();
  const [targetWordForEditing, setTargetWordForEditing] = useState('');
  const { toast } = useToast();

  const isPageInteractive =
    !isFetchingLevels && !isLoading && !isAutoGenerating;

  const router = useRouter();

  useEffect(() => {
    if (!user || user.email !== 'xmliszt@gmail.com') {
      toast({
        title: 'You are not authorized to view this page!',
        status: 'error',
      });
      router.push('/');
    }
  }, [user]);

  useEffect(() => {
    let levelToSelect;
    if (!selectedLevel) {
      levelToSelect = levels[0];
    } else {
      levelToSelect = levels.filter(
        (level) => level.name === selectedLevel?.name
      )[0];
    }
    levelToSelect && setSelectedLevel(levelToSelect);
    levelToSelect && getCachedWordList(levelToSelect);
  }, [levels]);

  const getCachedWordList = async (selectedLevel: ILevel) => {
    setFullWordList([]);
    selectedLevel.words.forEach(async (word) => {
      const tabooWords = await getTabooWords(word);
      if (tabooWords.length === 0) {
        console.log(`Word: [${word}] does not have cached taboo words.`);
      } else {
        setFullWordList((wordList) => [...wordList, word]);
      }
    });
  };

  const onLevelSelected = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedLevel = levels.filter(
      (level) => level.name === e.target.value
    )[0];
    setTabooWords(undefined);
    setCurrentEditingIndex(-1);
    setCurrentEditingTargetWordIndex(undefined);
    setTargetWordForEditing('');
    setEditText('');
    setSelectedLevel(selectedLevel);
    await getCachedWordList(selectedLevel);
  };

  const getVariationsForWord = async (word: string) => {
    if (word.length <= 0) {
      return;
    }
    const savedWords = await getTabooWords(word);
    if (savedWords.length > 0) {
      const variations: IWord = { target: word, taboos: savedWords };
      setTabooWords(variations);
      return variations;
    } else {
      const variations = await askAITabooWordsForTarget(word);
      setTabooWords(variations);
      return variations;
    }
  };

  const startEditWord = (idx: number, word: string) => {
    setEditText(word);
    setCurrentEditingIndex(idx);
  };

  const addNewWord = () => {
    if (taboos) {
      setEditText('');
      setCurrentEditingIndex(taboos?.taboos.length);
      const currentVariations = taboos.taboos;
      currentVariations.push('');
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const deleteWord = (idx: number) => {
    setEditText('');
    if (currentEditingIndex === idx) {
      setCurrentEditingIndex(-1);
    }
    if (taboos) {
      const currentVariations = taboos.taboos;
      currentVariations.splice(idx, 1);
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const refreshWord = async (word: string) => {
    setEditText('');
    const variations = await askAITabooWordsForTarget(word);
    setTabooWords(variations);
  };

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEditText(e.target.value);
    const currentVariations = taboos?.taboos;
    if (currentVariations) {
      currentVariations[currentEditingIndex] = e.target.value;
      setTabooWords({ ...taboos, taboos: currentVariations });
    }
  };

  const onEditTargetWord = (e: ChangeEvent<HTMLInputElement>) => {
    setTargetWordForEditing(e.target.value);
    if (selectedLevel && currentEditingTargetWordIndex !== undefined) {
      selectedLevel.words[currentEditingTargetWordIndex] = e.target.value;
    }
  };

  const onSave = async () => {
    if (currentTarget && taboos) {
      await addTabooWords(
        currentTarget,
        taboos.taboos.map((w) => _.trim(_.toLower(w)))
      );
      selectedLevel && (await updateLevel(selectedLevel));
      setFullWordList((wordList) => [
        ...wordList,
        _.trim(_.toLower(currentTarget)),
      ]);
      toast({ title: 'Saved successfully!', status: 'success' });
    } else {
      toast({
        title: 'No target word or variations available!',
        status: 'error',
      });
    }
  };

  const generateForAll = async () => {
    const words = selectedLevel?.words;
    setIsAutoGenerating(true);
    if (words) {
      for (let i = 0; i < words.length; i++) {
        const target = words[i];
        setCurrentTarget(target);
        try {
          await autoGenerateWithDelay(1000, target);
        } catch {
          continue;
        }
      }
    }
    setIsAutoGenerating(false);
  };

  const autoGenerateWithDelay = async (
    delay: number,
    target: string
  ): Promise<void> => {
    return new Promise((res, rej) => {
      setTimeout(async () => {
        try {
          const savedWords = await getTabooWords(target);
          if (savedWords.length > 0) {
            res();
          } else {
            const taboos = await askAITabooWordsForTarget(target);
            if (target && taboos) {
              await addTabooWords(
                target,
                taboos.taboos.map((w) => _.trim(_.toLower(w)))
              );
              setFullWordList((wordList) => [
                ...wordList,
                _.trim(_.toLower(target)),
              ]);
              toast({ title: 'Saved successfully!', status: 'success' });
            } else {
              toast({
                title: 'No target word or variations available!',
                status: 'error',
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

  useEffect(() => {
    if (selectedLevel && currentEditingTargetWordIndex !== undefined) {
      setTargetWordForEditing(
        selectedLevel.words[currentEditingTargetWordIndex]
      );
    }
  }, [currentEditingTargetWordIndex, selectedLevel]);

  const deleteTargetWord = (index: number) => {
    if (!selectedLevel) {
      return;
    }
    const level = { ...selectedLevel };
    level.words.splice(index);
    setSelectedLevel(level);
    const newTarget = level.words[level.words.length - 1];
    setCurrentTarget(newTarget);
    getVariationsForWord(newTarget);
    setCurrentEditingIndex(level.words.length - 1);
  };

  const addNewTargetWord = () => {
    if (!selectedLevel) {
      return;
    }
    const level = { ...selectedLevel };
    level.words.push('');
    setSelectedLevel(level);
  };

  const rejectLevel = async () => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        await deleteLevel(selectedLevel.id);
        setSelectedLevel(null);
        toast({ title: 'Level deleted successfully!', status: 'success' });
        await refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: `Unable to reject level: ${error.message}`,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: 'Unable to reject level as no level is selected!',
        status: 'error',
      });
    }
  };

  const setVerifyLevel = async () => {
    if (selectedLevel) {
      try {
        setIsLoading(true);
        await verifyLevel(selectedLevel.id);
        toast({ title: 'Level verified successfully!', status: 'success' });
        await refetch();
      } catch (error) {
        console.error(error);
        toast({
          title: `Unable to verify level: ${error.message}`,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: 'Unable to verify level as no level is selected!',
        status: 'error',
      });
    }
  };

  const setLevelIsNew = async (isNew: boolean) => {
    if (selectedLevel) {
      selectedLevel.isNew = isNew;
      try {
        setIsLoading(true);
        await updateLevel(selectedLevel);
        toast({ title: 'Level updated successfully!', status: 'success' });
      } catch (error) {
        console.error(error);
        toast({
          title: `Unable to update level: ${error.message}`,
          status: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (
    !user ||
    status !== 'authenticated' ||
    user.email !== 'xmliszt@gmail.com'
  ) {
    return (
      <section className='w-full h-full flex justify-center items-center'>
        You are not authorized to view this page!
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-8 justify-center items-center py-20'>
      <div className='flex flex-row gap-2 justify-center items-center p-2'>
        {selectedLevel?.isVerified ? (
          <div className='bg-green text-white rounded-md drop-shadow-sm p-2'>
            Verified
          </div>
        ) : (
          <div className='bg-red text-white rounded-md drop-shadow-sm p-2'>
            Not Verified
          </div>
        )}
        <div className='bg-white text-black rounded-md drop-shadow-sm p-2'>
          {selectedLevel?.author ? `by: ${selectedLevel.author}` : 'No Author'}
        </div>
        <div
          className={`${
            selectedLevel?.isNew ? 'bg-green' : 'bg-red'
          } text-white rounded-md drop-shadow-sm p-2`}
        >
          NEW
        </div>
      </div>
      <div className='w-full px-8'>
        <Select
          disabled={!isPageInteractive}
          name='level'
          id='level'
          value={selectedLevel?.name}
          onChange={onLevelSelected}
          className='w-full text-white rounded-full px-4 py-2 appearance-none'
        >
          {levels.map((level, idx) => (
            <option key={idx} value={level.name}>
              {level.name}
            </option>
          ))}
        </Select>
      </div>
      <div className='w-full px-8 h-10'>
        <Input
          className='w-full h-full text-xl'
          value={targetWordForEditing}
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
      <div className='w-10/12 p-8 flex flex-wrap gap-4 max-h-52 overflow-y-scroll scrollbar-hide border-black border-2 rounded-xl shadow-lg'>
        {selectedLevel?.words.map((word, idx) => (
          <div key={idx} className='relative w-auto'>
            <Button
              disabled={!isPageInteractive}
              className={`p-3 rounded-lg w-auto leading-none ${
                fullWordList
                  .map((w) => _.trim(_.toLower(w)))
                  .includes(_.trim(_.toLower(word)))
                  ? '!bg-green !text-white'
                  : '!bg-yellow !text-black'
              } ${
                currentEditingTargetWordIndex === idx
                  ? '!border-1 !border-white'
                  : ''
              }`}
              key={idx}
              onClick={() => {
                setCurrentEditingTargetWordIndex(idx);
                setCurrentTarget(word);
                getVariationsForWord(word);
              }}
            >
              {word}
            </Button>
            {currentEditingTargetWordIndex === idx && (
              <>
                <IconButton
                  aria-label='refresh'
                  disabled={!isPageInteractive}
                  className='absolute -top-5 -left-4'
                  bg='orange'
                  rounded='full'
                  id='refresh'
                  size='xs'
                  data-style='none'
                  onClick={() => {
                    refreshWord(word);
                  }}
                  icon={<IoMdRefreshCircle />}
                />
                <IconButton
                  aria-label='delete'
                  size='xs'
                  disabled={!isPageInteractive}
                  className='absolute -top-5 -right-3 rounded-full p-2 bg-red text-white'
                  id='delete'
                  data-style='none'
                  onClick={() => {
                    deleteTargetWord(idx);
                  }}
                  icon={<BiMinusCircle />}
                />
              </>
            )}
          </div>
        ))}
        <Button
          disabled={
            selectedLevel === null ||
            selectedLevel?.words[selectedLevel.words.length - 1].length <= 0
          }
          onClick={addNewTargetWord}
        >
          <BiPlusCircle />
        </Button>
      </div>
      <hr className='bg-white h-1 w-full my-2' />
      <div className='w-10/12 flex flex-wrap gap-4'>
        {taboos?.taboos.map((word, idx) => (
          <div key={idx} className='relative w-auto'>
            <Button
              disabled={!isPageInteractive}
              variant='outline'
              color='white'
              colorScheme='gray'
              className={`p-3 rounded-lg w-auto leading-none ${
                currentEditingIndex === idx ? 'border-2 border-yellow' : ''
              } hover:text-black`}
              onClick={() => {
                startEditWord(idx, word);
              }}
            >
              {word}
            </Button>
            <IconButton
              aria-label='delete'
              disabled={!isPageInteractive}
              size='xs'
              className='absolute -top-5 -left-2 rounded-full p-2 bg-red text-xs'
              id='delete'
              data-style='none'
              onClick={() => {
                deleteWord(idx);
              }}
              icon={<AiFillDelete />}
            />
          </div>
        ))}
      </div>
      <div className='flex flex-row gap-4 w-full p-4 items-center'>
        <Input
          disabled={
            (taboos?.taboos.length ?? 0) <= 0 ||
            currentEditingIndex < 0 ||
            !isPageInteractive
          }
          placeholder='Pick a word to edit...'
          type='text'
          onChange={onEdit}
          value={editText}
          className='grow h-12 text-xl'
        />
        <IconButton
          aria-label='add word'
          disabled={!isPageInteractive}
          className='text-black rounded-full drop-shadow-lg text-4xl'
          id='add'
          data-style='none'
          onClick={addNewWord}
          icon={<IoMdAddCircle />}
        />
      </div>
      <div className='w-10/12 text-base flex flex-row gap-4 justify-center'>
        <Button
          disabled={
            !isPageInteractive ||
            !selectedLevel?.words.every((s) => s.length > 0)
          }
          variant='solid'
          className='flex-grow'
          onClick={onSave}
        >
          SAVE
        </Button>
        <Button
          variant='solid'
          disabled={!isPageInteractive}
          className='flex-grow'
          onClick={generateForAll}
        >
          AUTO GENERATE
        </Button>
      </div>
      <div className='w-10/12 text-base flex flex-row gap-4 justify-center'>
        <Button
          disabled={!isPageInteractive}
          className='flex-grow !bg-red'
          onClick={() => {
            setLevelIsNew(false);
          }}
        >
          NEW = false
        </Button>
        <Button
          disabled={!isPageInteractive}
          className='flex-grow !bg-green'
          onClick={() => {
            setLevelIsNew(true);
          }}
        >
          NEW = true
        </Button>
      </div>
      <div className='w-10/12 text-base flex flex-row gap-4 justify-center'>
        <Button
          disabled={!isPageInteractive}
          className='flex-grow !bg-red'
          onClick={rejectLevel}
        >
          REJECT
        </Button>
        {!selectedLevel?.isVerified && (
          <Button
            disabled={!isPageInteractive}
            className='flex-grow !bg-green'
            onClick={setVerifyLevel}
          >
            VERIFY
          </Button>
        )}
      </div>
    </section>
  );
};

export default DevReviewWordsPage;
