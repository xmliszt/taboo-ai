'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import IVariation from '../(models)/variationModel';
import {
  getWordVariations,
  isWordVariationsExist,
} from '../../lib/services/aiService';
import { getLevels } from '../../lib/services/levelService';
import ILevel from '../levels/(models)/level.interface';
import { IoMdAddCircle, IoMdRefreshCircle } from 'react-icons/io';
import { AiFillDelete, AiFillRest } from 'react-icons/ai';
import {
  getFullWordList,
  getTabooWords,
  saveTabooWords,
} from '../../lib/services/wordService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import _ from 'lodash';

const DevPage = () => {
  const [levels, setLevels] = useState<ILevel[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<ILevel | null>(null);
  const [variations, setVariations] = useState<IVariation>();
  const [editText, setEditText] = useState<string>();
  const [currentEditingIndex, setCurrentEditingIndex] = useState<number>(-1);
  const [currentTarget, setCurrentTarget] = useState<string>();
  const [fullWordList, setFullWordList] = useState<string[]>([]);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  const fetchLevels = async () => {
    const levels = await getLevels();
    setLevels(levels);
    setSelectedLevel(levels[0]);
    const wordList = await getFullWordList();
    setFullWordList(wordList.map((w) => w.word));
  };

  const onLevelSelected = async (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedLevel = levels.filter(
      (level) => level.name === e.target.value
    )[0];
    setVariations(undefined);
    setCurrentEditingIndex(-1);
    setEditText('');
    setSelectedLevel(selectedLevel);
    const wordList = await getFullWordList();
    setFullWordList(wordList.map((w) => w.word));
  };

  const getVariationsForWord = async (word: string) => {
    const savedWords = await getTabooWords(word);
    if (savedWords.length > 0) {
      const variations: IVariation = { target: word, variations: savedWords };
      setVariations(variations);
      return variations;
    } else {
      const variations = await getWordVariations(word);
      setVariations(variations);
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
    const variations = await getWordVariations(word);
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
    if (currentTarget && variations) {
      await saveTabooWords(currentTarget, variations);
      setFullWordList((wordList) => [...wordList, currentTarget]);
      toast.success('Taboo words saved successfully!');
    } else {
      toast.error('No target word or variations available!');
    }
  };

  const generateForAll = async () => {
    const words = selectedLevel?.words;
    setIsAutoGenerating(true);
    if (words) {
      for (let i = 0; i < words.length; i++) {
        const target = words[i];
        setCurrentTarget(target);
        await autoGenerateWithDelay(1000, target);
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
            const variations = await getWordVariations(target);
            if (target && variations) {
              await saveTabooWords(target, variations);
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

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme='light'
      />
      <section className='flex flex-col gap-8 justify-center items-center py-20'>
        <div>
          <select
            disabled={isAutoGenerating}
            name='level'
            id='level'
            onChange={onLevelSelected}
            className='text-black'
          >
            {levels.map((level, idx) => (
              <option key={idx} value={level.name}>
                {level.name}
              </option>
            ))}
          </select>
        </div>
        <div className='w-10/12 grid grid-cols-3 lg:grid-cols-10 gap-4'>
          {selectedLevel?.words.map((word, idx) => (
            <div key={idx} className='relative w-full'>
              <button
                disabled={isAutoGenerating}
                className={`p-3 rounded-lg w-full leading-none ${
                  fullWordList.includes(word)
                    ? '!bg-green !text-white'
                    : '!bg-yellow !text-black'
                } ${currentTarget === word ? '!border-red' : ''}`}
                key={idx}
                onClick={() => {
                  setCurrentTarget(word);
                  getVariationsForWord(word);
                }}
              >
                {word}
              </button>
              {currentTarget === word && (
                <button
                  disabled={isAutoGenerating}
                  className='absolute -top-5 -right-2 rounded-full p-2 bg-yellow text-lg'
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
        <hr className='bg-white h-1 w-full my-8' />
        <div className='w-10/12 grid grid-cols-3 lg:grid-cols-10 gap-4'>
          {variations?.variations.map((word, idx) => (
            <div key={idx} className='relative w-full'>
              <button
                disabled={isAutoGenerating}
                className={`p-3 rounded-lg w-full leading-none`}
                onClick={() => {
                  startEditWord(idx, word);
                }}
              >
                {word}
              </button>
              <button
                disabled={isAutoGenerating}
                className='absolute -top-5 right-0 rounded-full p-2 bg-red text-xs'
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
        <div className='flex flex-row gap-4 w-10/12'>
          <input
            disabled={
              isAutoGenerating ||
              (variations?.variations.length ?? 0) <= 0 ||
              currentEditingIndex < 0
            }
            placeholder='Pick a word to edit...'
            type='text'
            onChange={onEdit}
            value={editText}
            className='grow'
          />
          <button
            disabled={isAutoGenerating}
            className='text-2xl'
            id='add'
            onClick={addNewWord}
          >
            <IoMdAddCircle />
          </button>
        </div>
        <div className='w-10/12 h-24 text-4xl flex flex-row gap-4 justify-center'>
          <button
            disabled={isAutoGenerating}
            className='flex-grow'
            onClick={onSave}
          >
            SAVE
          </button>
          <button
            disabled={isAutoGenerating}
            className='flex-grow'
            onClick={generateForAll}
          >
            AUTO GENERATE
          </button>
        </div>
      </section>
    </>
  );
};

export default DevPage;
