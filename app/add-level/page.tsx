'use client';

import {
  Card,
  CardBody,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Stack,
  StackDivider,
  Fade,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiArrowUp, FiTrash2 } from 'react-icons/fi';
import { RiAddFill } from 'react-icons/ri';

const AddLevelPage = () => {
  const MAX_TARGET_WORDS_COUNT = 10;
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [tabooWords, setTabooWords] = useState<string[][]>([]);

  const addNewTargetWord = () => {
    setTargetWords((w) => [...w, '']);
    setTabooWords((w) => [...w, []]);
    document.getElementById(`target-${targetWords.length}`)?.focus();
  };

  const changeTargetWordAtIndex = (changeValue: string, index: number) => {
    const words = [...targetWords];
    words[index] = changeValue;
    setTargetWords(words);
  };

  const deleteTargetWordAtIndex = (index: number) => {
    const words = [...targetWords];
    words.splice(index, 1);
    const tWords = [...tabooWords];
    tWords.splice(index, 1);
    setTargetWords(words);
    setTabooWords(tWords);
  };

  const addNewTabooWord = (forTargetAtIndex: number) => {
    const words = [...tabooWords];
    words[forTargetAtIndex].push('');
    setTabooWords(words);
    document
      .getElementById(
        `target-${forTargetAtIndex}-${words[forTargetAtIndex].length - 1}`
      )
      ?.focus();
  };

  const changeTabooWordAtIndex = (
    changeValue: string,
    forTargetAtIndex: number,
    forTabooAtIndex: number
  ) => {
    const words = [...tabooWords];
    words[forTargetAtIndex][forTabooAtIndex] = changeValue;
    setTabooWords(words);
  };

  const deleteTabooWordAtIndex = (
    forTargetAtIndex: number,
    forTabooAtIndex: number
  ) => {
    const words = [...tabooWords];
    words[forTargetAtIndex].splice(forTabooAtIndex, 1);
    setTabooWords(words);
  };

  const scrollToTop = () => {
    document
      .getElementById('add-topic-card')
      ?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight =
      document.getElementById('add-topic-card')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    if (clientHeight && scrollTop > clientHeight * 0.5) {
      !isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(true);
    } else {
      isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(false);
    }
  };

  return (
    <Card
      id='add-topic-card'
      className='relative w-[95%] h-full mb-4 overflow-y-scroll scrollbar-hide bg-black-darker text-white leading-4 border-2 border-white'
      onScroll={onScrollChange}
    >
      <Fade
        className='fixed bottom-6 right-4 z-50'
        in={isScrollToTopButtonVisible}
      >
        <IconButton
          data-style='none'
          variant='solid'
          className=' bg-white text-black hover:text-white hover:bg-black focus:bg-black-darker drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]'
          fontSize={26}
          aria-label='click to scroll back to top'
          onClick={scrollToTop}
          icon={<FiArrowUp />}
        />
      </Fade>
      <CardBody>
        <Stack divider={<StackDivider />} spacing={4}>
          <FormControl>
            <FormLabel className='text-bold text-lg text-yellow'>
              1. Topic name
            </FormLabel>
            <Input />
          </FormControl>
          <FormControl>
            <FormLabel className='text-bold text-lg text-yellow'>
              2. Give at least 3 target words relevant to the topic provided
            </FormLabel>
            <div className='flex flex-row flex-wrap gap-4 justify-start items-center w-full my-4'>
              {targetWords.map((w, i) => (
                <div key={i} className='w-full lg:w-52 relative'>
                  <Input
                    id={`target-${i}`}
                    className='w-full'
                    value={w}
                    placeholder='target word...'
                    onChange={(e) => {
                      changeTargetWordAtIndex(e.target.value, i);
                    }}
                  />
                  <IconButton
                    data-style='none'
                    variant='solid'
                    colorScheme='red'
                    isRound
                    fontSize={16}
                    size='sm'
                    className='text-white bg-red absolute -top-2 -right-4 z-10 p-2'
                    aria-label={`delete this target word with index ${i}`}
                    onClick={() => {
                      deleteTargetWordAtIndex(i);
                    }}
                    icon={<FiTrash2 />}
                  />
                </div>
              ))}
              <IconButton
                hidden={targetWords.length >= MAX_TARGET_WORDS_COUNT}
                key='add-button'
                data-style='none'
                variant='outline'
                className='text-white hover:text-black '
                aria-label='add a new target word'
                fontSize={24}
                onClick={addNewTargetWord}
                icon={<RiAddFill />}
              />
            </div>
          </FormControl>
          <FormControl
            hidden={
              targetWords.length <= 0 || targetWords.every((v) => v.length <= 0)
            }
          >
            <FormLabel className='text-bold text-lg text-yellow'>
              3. For each target word, define at least 5 taboo words
            </FormLabel>
            <Accordion allowMultiple>
              {targetWords.map((w, i) =>
                w.length > 0 ? (
                  <AccordionItem key={i}>
                    <h2>
                      <AccordionButton data-style='none'>
                        <Box as='span' flex='1' textAlign='left'>
                          Target Word: <b>{w}</b>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel key={i} pb={4}>
                      <div className='flex flex-row flex-wrap gap-4 justify-start items-center w-full my-4'>
                        {tabooWords[i].map((tw, ti) => (
                          <div key={ti} className='w-full lg:w-52 relative'>
                            <Input
                              id={`taboo-${i}-${ti}`}
                              key={`taboo-${i}-${ti}`}
                              className='w-full'
                              value={tw}
                              placeholder='taboo word...'
                              onChange={(e) => {
                                changeTabooWordAtIndex(e.target.value, i, ti);
                              }}
                            />
                            <IconButton
                              data-style='none'
                              variant='solid'
                              colorScheme='red'
                              isRound
                              fontSize={16}
                              size='sm'
                              className='text-white bg-red absolute -top-2 -right-4 z-10 p-2'
                              aria-label={`delete this target word with index ${i}`}
                              onClick={() => {
                                deleteTabooWordAtIndex(i, ti);
                              }}
                              icon={<FiTrash2 />}
                            />
                          </div>
                        ))}
                        <IconButton
                          key='add-button'
                          data-style='none'
                          variant='outline'
                          className='text-white hover:text-black '
                          aria-label='add a new target word'
                          fontSize={24}
                          onClick={() => {
                            addNewTabooWord(i);
                          }}
                          icon={<RiAddFill />}
                        />
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                ) : (
                  <></>
                )
              )}
            </Accordion>
          </FormControl>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default AddLevelPage;
