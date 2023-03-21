'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { AiFillDelete } from 'react-icons/ai';
import { IoMdAddCircle, IoMdRefreshCircle } from 'react-icons/io';
import { toast } from 'react-toastify';
import LoadingMask from '../../(components)/Loading';
import {
  getTodayTopicLevel,
  getWordVariations,
} from '../../../lib/services/frontend/aiService';
import {
  createDailyLevel,
  getDailyLevel,
} from '../../../lib/services/frontend/levelService';
import {
  getVariations,
  saveVariations,
} from '../../../lib/services/frontend/wordService';
import IDailyLevel from '../../../types/dailyLevel.interface';
import IVariation from '../../../types/variation.interface';

const DailyWordGenerationPage = () => {
  const [topic, setTopic] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<number>(1);
  const [level, setLevel] = useState<IDailyLevel | undefined>();
  const [selectedWord, setSelectedWord] = useState<string | undefined>();
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [variations, setVariations] = useState<IVariation>();
  const [editText, setEditText] = useState<string>();
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(-1);
  const [fullWordList, setFullWordList] = useState<string[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [isVariationLoading, setIsVariationLoading] = useState(false);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTopic(e.target.value);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setVariations(undefined);
    setEditText(undefined);
    setCurrentEditingIndex(-1);
    setSelectedWord(undefined);
    setSelectedIndex(undefined);
    if (topic && difficulty) {
      try {
        setIsLoading(true);
        setLoadingMessage("Generate today's level...");
        const level = await getTodayTopicLevel(topic, difficulty);
        setIsLoading(false);
        setLevel(level);
      } catch (error) {
        console.error(error);
        toast.error('Error generating level!');
      }
    }
  };

  const onSelectWord = (idx: number) => {
    if (level) {
      setSelectedIndex(idx);
      setSelectedWord(level.words[idx]);
      getVariationsForWord(level.words[idx]);
    }
  };

  const onDifficultyChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setDifficulty(Number(e.target.value));
    if (level) {
      level.difficulty = Number(e.target.value);
      setLevel(level);
    }
  };

  const onSelectedWordChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSelectedWord(e.target.value);
    if (level && selectedIndex !== undefined) {
      level.words[selectedIndex] = e.target.value;
      setLevel(level);
    }
  };

  const submitDailyLevel = () => {
    confirmAlert({
      title: 'Are you sure?',
      message:
        'No more changes? Once submitted cannot be changed for today anymore.',
      buttons: [
        {
          label: "Let's Do It!",
          onClick: () => {
            submit();
          },
        },
        { label: 'Ah forgot to change something!' },
      ],
    });
  };

  const submit = async () => {
    if (level) {
      try {
        setIsLoading(true);
        setLoadingMessage('Submitting new level for today...');
        const dailyLevel = await getDailyLevel();
        if (!dailyLevel) {
          await createDailyLevel(level);
          toast.success('Daily level submitted successfully!');
        } else {
          toast.warn('Daily level already existed!');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('No level to be submitted');
    }
  };

  //ANCHOR - Taboo word generation section

  const getVariationsForWord = async (word: string) => {
    setIsVariationLoading(true);
    const savedWords = await getVariations(word);
    if (savedWords.length > 0) {
      const variations: IVariation = { target: word, variations: savedWords };
      setVariations(variations);
      setIsVariationLoading(false);
      return variations;
    } else {
      const variations = await getWordVariations(word);
      setVariations(variations);
      setIsVariationLoading(false);
      return variations;
    }
  };

  const startEditWord = (idx: number, word: string) => {
    setEditText(word);
    setCurrentEditingIndex(idx);
  };

  const addNewWord = () => {
    if (variations) {
      setEditText('');
      setCurrentEditingIndex(variations?.variations.length);
      const currentVariations = variations.variations;
      currentVariations.push('');
      setVariations({ ...variations, variations: currentVariations });
    }
  };

  const deleteWord = (idx: number) => {
    setEditText('');
    if (currentEditingIndex === idx) {
      setCurrentEditingIndex(-1);
    }
    if (variations) {
      const currentVariations = variations.variations;
      currentVariations.splice(idx, 1);
      setVariations({ ...variations, variations: currentVariations });
    }
  };

  const refreshWord = async (word: string) => {
    setEditText('');
    setIsVariationLoading(true);
    const variations = await getWordVariations(word);
    setIsVariationLoading(false);
    setVariations(variations);
  };

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEditText(e.target.value);
    const currentVariations = variations?.variations;
    if (currentVariations) {
      currentVariations[currentEditingIndex] = e.target.value;
      setVariations({ ...variations, variations: currentVariations });
    }
  };

  const onSave = async () => {
    if (selectedWord && variations) {
      await saveVariations(variations);
      setFullWordList((wordList) => [...wordList, selectedWord]);
      toast.success('Taboo words saved successfully!');
    } else {
      toast.error('No target word or variations available!');
    }
  };

  const generateForAll = async () => {
    const words = level?.words;
    setIsAutoGenerating(true);
    if (words) {
      for (let i = 0; i < words.length; i++) {
        const target = words[i];
        setSelectedWord(target);
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
          const savedWords = await getVariations(target);
          if (savedWords.length > 0) {
            res();
          } else {
            const variations = await getWordVariations(target);
            if (target && variations) {
              await saveVariations(variations);
              setFullWordList((wordList) => [...wordList, target]);
              toast.success('Taboo words saved successfully!');
            } else {
              toast.error('No target word or variations available!');
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

  return (
    <>
      <LoadingMask
        isLoading={isLoading || isAutoGenerating || isVariationLoading}
        message={loadingMessage}
      />
      <section className='w-full flex flex-col gap-4 justify-center items-center overflow-y-scroll scrollbar-hide'>
        <form
          onSubmit={onSubmit}
          className='w-full flex flex-col gap-4 text-center pt-16 items-center'
        >
          <label htmlFor='topic-input'>Enter Today&apos;s Topic</label>
          <input
            id='topic-input'
            type='text'
            placeholder="Today's Topic..."
            onChange={onInputChange}
            className='w-64 border-yellow'
          />
          <div className='flex flex-row gap-4 items-center'>
            <label htmlFor='difficulty'>Difficulty Level: </label>
            <select
              name='difficulty'
              id='difficulty'
              value={difficulty}
              aria-labelledby='difficultyLabel'
              aria-label='select difficulty'
              onChange={onDifficultyChanged}
              className='form-select appearance-none h-8 px-4 rounded-2xl hover:cursor-pointer text-black text-base bg-yellow text-center'
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
          </div>
          <button
            type='submit'
            className='h-8 w-32 !rounded-3xl'
            disabled={!topic || !difficulty}
          >
            Generate!
          </button>
        </form>
        {level && (
          <section className='flex flex-col gap-4 pb-16 px-8'>
            <input
              disabled={
                selectedIndex === undefined || selectedWord === undefined
              }
              value={selectedWord ?? ''}
              onChange={onSelectedWordChange}
            />
            <div className='flex flex-row flex-wrap gap-4'>
              {level.words.map((word, idx) => (
                <div key={idx} className='relative'>
                  <button
                    key={idx}
                    className={`!rounded-full w-full p-2 ${
                      idx === selectedIndex
                        ? '!border-red-light !border-2  w-full'
                        : ''
                    } ${
                      fullWordList.includes(word)
                        ? '!bg-green !text-white'
                        : '!bg-black !text-white'
                    }`}
                    onClick={() => {
                      onSelectWord(idx);
                    }}
                  >
                    {word}
                  </button>
                  {selectedWord === word && (
                    <button
                      disabled={isAutoGenerating}
                      className='absolute -top-2 -right-1 rounded-full p-0 bg-yellow text-base'
                      id='delete'
                      onClick={() => {
                        refreshWord(word);
                      }}
                    >
                      <IoMdRefreshCircle />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className='flex flex-row gap-2 items-center'>
              <hr className='bg-white flex-grow' />
              <span className='m-auto'>Taboo Words</span>
              <hr className='bg-white flex-grow' />
            </div>
            <div className='w-full grid grid-cols-4 lg:grid-cols-10 gap-4'>
              {variations?.variations.map((word, idx) => (
                <div key={idx} className='relative w-full'>
                  <button
                    disabled={isAutoGenerating}
                    className={`p-2 !rounded-full w-full leading-none`}
                    onClick={() => {
                      startEditWord(idx, word);
                    }}
                  >
                    {word}
                  </button>
                  <button
                    disabled={isAutoGenerating}
                    className='absolute -top-2 right-2 rounded-full p-1 bg-red text-sm'
                    id='delete'
                    onClick={() => {
                      deleteWord(idx);
                    }}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              ))}
            </div>
            <div className='flex flex-row gap-4 w-full'>
              <input
                disabled={
                  isAutoGenerating ||
                  (variations?.variations.length ?? 0) <= 0 ||
                  currentEditingIndex < 0
                }
                placeholder='Pick a word to edit...'
                type='text'
                onChange={onEdit}
                value={editText ?? ''}
                className='grow'
              />
              <button
                disabled={isAutoGenerating || !selectedWord}
                className='text-2xl'
                id='add'
                onClick={addNewWord}
              >
                <IoMdAddCircle />
              </button>
            </div>
            <div className='w-full h-8 text-base flex flex-row gap-4 justify-center'>
              <button
                disabled={isAutoGenerating || !selectedWord || !variations}
                className='!rounded-full !px-2'
                onClick={onSave}
              >
                SAVE
              </button>
              <button
                disabled={isAutoGenerating}
                className='!rounded-full !px-2'
                onClick={generateForAll}
              >
                AUTO GENERATE
              </button>
            </div>
            <button
              className='p-2'
              onClick={submitDailyLevel}
              disabled={
                !level.words.every((word) => fullWordList.includes(word))
              }
            >
              Submit Today&apos;s Words
            </button>
          </section>
        )}
      </section>
    </>
  );
};

export default DailyWordGenerationPage;
