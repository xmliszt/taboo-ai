'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import IVariation from '../(models)/variationModel';
import { getWordVariations } from '../../lib/services/aiService';
import { getLevels } from '../../lib/services/levelService';
import ILevel from '../levels/(models)/level.interface';
import { IoMdAddCircle } from 'react-icons/io';
import { AiFillDelete } from 'react-icons/ai';
import {
  getFullWordList,
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

  const fetchLevels = async () => {
    const levels = await getLevels();
    setLevels(levels);
    setSelectedLevel(levels[0]);
    const wordList = await getFullWordList();
    setFullWordList(wordList.map((w) => w.word));
  };

  const onLevelSelected = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedLevel = levels.filter(
      (level) => level.name === e.target.value
    )[0];
    setVariations(undefined);
    setCurrentEditingIndex(-1);
    setEditText('');
    setSelectedLevel(selectedLevel);
  };

  const getVariationsForWord = async (word: string) => {
    const variations = await getWordVariations(word);
    setVariations(variations);
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
      toast.success('Taboo words saved successfully!');
    } else {
      toast.error('No target word or variations available!');
    }
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
            <button
              className={`p-3 rounded-lg w-full leading-none ${
                fullWordList.includes(word)
                  ? '!bg-green !text-white'
                  : '!bg-yellow !text-black'
              }`}
              key={idx}
              onClick={() => {
                setCurrentTarget(word);
                getVariationsForWord(word);
              }}
            >
              {word}
            </button>
          ))}
        </div>
        <hr className='bg-white h-1 w-full my-8' />
        <div className='w-10/12 grid grid-cols-3 lg:grid-cols-10 gap-4'>
          {variations?.variations.map((word, idx) => (
            <div key={idx} className='relative w-full'>
              <button
                className={`p-3 rounded-lg w-full leading-none`}
                onClick={() => {
                  startEditWord(idx, word);
                }}
              >
                {word}
              </button>
              <button
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
              (variations?.variations.length ?? 0) <= 0 ||
              currentEditingIndex < 0
            }
            placeholder='Pick a word to edit...'
            type='text'
            onChange={onEdit}
            value={editText}
            className='grow'
          />
          <button className='text-2xl' id='add' onClick={addNewWord}>
            <IoMdAddCircle />
          </button>
        </div>
        <button className='w-10/12 h-24 text-4xl' onClick={onSave}>
          SAVE
        </button>
      </section>
    </>
  );
};

export default DevPage;
