'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import _, { zip } from 'lodash';
import { ChevronsUp, Info, Plus, SpellCheck, Trash } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/components/auth-provider';
import { InfoButton } from '@/components/custom/info-button';
import { Skeleton } from '@/components/custom/skeleton';
import { Spinner } from '@/components/custom/spinner';
import { TopicReviewSheet } from '@/components/custom/topic-review-sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import IconButton from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { sendEmail } from '@/lib/services/emailService';
import { fetchTabooWords } from '@/lib/services/wordService';
import { cn } from '@/lib/utils';

const CHARACTER_LIMIT = 50;
const MAX_TARGET_WORDS_COUNT = 10;
const MAX_TABOO_WORDS_COUNT = 10;
const VALID_WORD_REGEX = /\s*(\w+[\s']?)+/;
const INVALID_WORD_ERROR =
  'Only single space or a single quotation mark is allowed between words. No special characters are allowed. Cannot be empty. e.g.: invalid - "Mc-Donalds", valid - "McDonald\'s"';

const AddLevelPage = () => {
  const { user, status } = useAuth();
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] = useState(false);
  const [topicName, setTopicName] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('1');
  const [shouldUseAIForTabooWords, setShouldUseAIForTabooWords] = useState(true);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [tabooWords, setTabooWords] = useState<string[][]>([]);
  const [tabooWordsCheckingStatus, setTabooWordsCheckingStatus] = useState<boolean[]>([]);
  const [tabooWordsExistedStatus, setTabooWordsExistedStatus] = useState<(boolean | null)[]>([]);
  const [topicNameErrorMessage, setTopicNameErrorMessage] = useState('');
  const [targetWordsErrorMessage, setTargetWordsErrorMessage] = useState('');
  const [targetWordsErrorIndexs, setTargetWordsErrorIndexs] = useState<number[]>([]);
  const [tabooWordsErrorMessages, setTabooWordsErrorMessages] = useState<string[]>([]);
  const [tabooWordsErrorIndexs, setTabooWordsErrorIndexs] = useState<number[][]>([]);

  //ANCHOR - States for appeal
  const [selectedWordForAppeal, setselectedWordForAppeal] = useState('');
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealReasons, setAppealReasons] = useState('');
  const [appealReasonErrorMessage, setAppealReasonErrorMessage] = useState('');

  //ANCHOR - States for component control
  const [expandedAccItem, setExpandedAccItem] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.warning('You need to sign in to contribute a topic');
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    validateTargetWords();
  }, [targetWords]);

  useEffect(() => {
    validateTabooWords(Number(expandedAccItem));
  }, [tabooWords, expandedAccItem]);

  const validateInputEntry = useCallback(
    (input: string): { isValid: boolean; message: string } => {
      if (input.length === 0) {
        return { isValid: false, message: 'Cannot be empty!' };
      }
      const matches = VALID_WORD_REGEX.exec(input);
      if (matches && matches[0] === input) {
        return { isValid: true, message: '' };
      } else {
        return { isValid: false, message: INVALID_WORD_ERROR };
      }
    },
    [VALID_WORD_REGEX]
  );

  const onReviewTopic = () => {
    let targets = [...targetWords];
    targets = targets.filter((t) => _.trim(t).length > 0);
    setTargetWords(targets);
    setReviewSheetOpen(true);
  };

  const onTopicNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const changeValue = e.target.value;
    if (changeValue.length > CHARACTER_LIMIT) return;
    setTopicName(changeValue);
    const result = validateInputEntry(changeValue);
    setTopicNameErrorMessage(result.isValid ? '' : result.message);
  };

  const onAppealReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAppealReasons(e.target.value);
    validateAppealReason(e.target.value);
  };

  const validateAppealReason = (reason: string) => {
    setAppealReasonErrorMessage(reason.length <= 0 ? 'Reason cannot be empty!' : '');
  };

  const checkIfTabooWordsExistedForTarget = async (targetWordIndex: number) => {
    const statuses = [...tabooWordsCheckingStatus];
    statuses[targetWordIndex] = true;
    setTabooWordsCheckingStatus(statuses);
    try {
      const taboo = await fetchTabooWords(targetWords[targetWordIndex]);
      const existed = taboo !== undefined;
      const existedStatues = [...tabooWordsExistedStatus];
      existedStatues[targetWordIndex] = existed;
      setTabooWordsExistedStatus(existedStatues);
      if (existed && taboo) {
        const _tabooWords = [...tabooWords];
        _tabooWords[targetWordIndex] = taboo.taboos;
        setTabooWords(_tabooWords);
        const errorMessages = [...tabooWordsErrorMessages];
        errorMessages[targetWordIndex] = '';
        setTabooWordsErrorMessages(errorMessages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      const statuses = [...tabooWordsCheckingStatus];
      statuses[targetWordIndex] = false;
      setTabooWordsCheckingStatus(statuses);
    }
  };

  const addNewTargetWord = () => {
    const finalIndex = targetWords.length;
    setTargetWords((w) => [...w, '']);
    setTabooWords((w) => [...w, []]);
    setTabooWordsErrorMessages((m) => [...m, '']);
    setTabooWordsCheckingStatus((c) => [...c, false]);
    setTabooWordsExistedStatus((e) => [...e, null]);
    document.getElementById(`target-input-${finalIndex}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  const changeTargetWordAtIndex = (changeValue: string, index: number) => {
    if (changeValue.length > CHARACTER_LIMIT) return;
    const words = [...targetWords];
    words[index] = changeValue;
    setTargetWords(words);
    const tabooWordsExistedStatuses = [...tabooWordsExistedStatus];
    tabooWordsExistedStatuses[index] = null;
    setTabooWordsExistedStatus(tabooWordsExistedStatuses);
    const _tabooWords = [...tabooWords];
    _tabooWords[index] = [];
    setTabooWords(_tabooWords);
    const tabooErrorMessages = [...tabooWordsErrorMessages];
    tabooErrorMessages[index] =
      'You need to create at least 5 taboo words for ' + `"${changeValue}"`;
    setTabooWordsErrorMessages(tabooErrorMessages);
    if (Number(expandedAccItem) === index) {
      setExpandedAccItem('');
    }
  };

  const onTargetWordInputOutOfFocus = (targetWord: string) => {
    const result = validateInputEntry(targetWord);
    if (!result.isValid && targetWordsErrorMessage.length === 0) {
      setTargetWordsErrorMessage(result.message);
    }
  };

  const deleteTargetWordAtIndex = (index: number) => {
    const words = [...targetWords];
    words.splice(index, 1);
    const tWords = [...tabooWords];
    tWords.splice(index, 1);
    const messages = [...tabooWordsErrorMessages];
    messages.splice(index, 1);
    const statuses = [...tabooWordsCheckingStatus];
    statuses.splice(index, 1);
    const existedStatuses = [...tabooWordsExistedStatus];
    existedStatuses.splice(index, 1);
    setTargetWords(words);
    setTabooWords(tWords);
    setTabooWordsErrorMessages(messages);
    setTabooWordsCheckingStatus(statuses);
    setTabooWordsExistedStatus(existedStatuses);
    if (Number(expandedAccItem) === index) {
      setExpandedAccItem('');
    }
  };

  const addNewTabooWord = (forTargetAtIndex: number) => {
    const words = [...tabooWords];
    words[forTargetAtIndex].push('');
    setTabooWords(words);
  };

  const changeTabooWordAtIndex = (
    changeValue: string,
    forTargetAtIndex: number,
    forTabooAtIndex: number
  ) => {
    if (changeValue.length > CHARACTER_LIMIT) return;
    const words = [...tabooWords];
    words[forTargetAtIndex][forTabooAtIndex] = changeValue;
    setTabooWords(words);
    validateTabooWords(forTargetAtIndex);
  };

  const onTabooWordInputOutOfFocus = (forTargetAtIndex: number, tabooWord: string) => {
    const result = validateInputEntry(tabooWord);
    if (!result.isValid && tabooWordsErrorMessages[forTargetAtIndex].length === 0) {
      const tabooErrors = [...tabooWordsErrorMessages];
      tabooErrors[forTargetAtIndex] = result.message;
      setTabooWordsErrorMessages(tabooErrors);
    }
  };

  const deleteTabooWordAtIndex = (forTargetAtIndex: number, forTabooAtIndex: number) => {
    const words = [...tabooWords];
    words[forTargetAtIndex].splice(forTabooAtIndex, 1);
    setTabooWords(words);
  };

  const validateTargetWords = () => {
    if (targetWords.filter((w) => w.length > 0).length < 3) {
      setTargetWordsErrorMessage('You need to create at least 3 target words for the topic.');
      setTargetWordsErrorIndexs([]);
      return;
    }
    const invalidTargetIndexs: number[] = [];
    const invalidTargetWords: string[] = [];
    // Check valid word
    for (let i = 0; i < targetWords.length; i++) {
      if (!validateInputEntry(targetWords[i]).isValid) {
        invalidTargetIndexs.push(i);
        invalidTargetWords.push(targetWords[i]);
      }
    }
    if (invalidTargetIndexs.length > 0) {
      const invalidItems = zip(invalidTargetIndexs, invalidTargetWords);
      setTargetWordsErrorMessage(
        `Some target words (${invalidItems.map((i) => {
          return `[${(i[0] ?? 0) + 1}: ${(i[1]?.length ?? 0) > 0 ? i[1] : '<empty>'}]`;
        })}) are not valid, or you have empty input. Please change them. ` + INVALID_WORD_ERROR
      );
      setTargetWordsErrorIndexs(invalidTargetIndexs);
      return;
    }

    if (_.uniq(targetWords.map(_.trim).map(_.toLower)).length < targetWords.length) {
      setTargetWordsErrorMessage('Please remove duplicate in your target words.');
      setTargetWordsErrorIndexs([]);
      return;
    }

    setTargetWordsErrorMessage('');
    setTargetWordsErrorIndexs([]);
  };

  const validateTabooWords = (forTargetIndex: number) => {
    if (forTargetIndex >= tabooWords.length) {
      return;
    }
    const messages = [...tabooWordsErrorMessages];
    const errorIndexes = [...tabooWordsErrorIndexs];
    if (tabooWords[forTargetIndex].filter((w) => w.length > 0).length < 5) {
      messages[forTargetIndex] =
        `You need to create at least 5 taboo words for "${targetWords[forTargetIndex]}".`;
      errorIndexes[forTargetIndex] = [];
    } else {
      const inValidIndexes: number[] = [];
      const inValidTabooWords: string[] = [];
      for (let i = 0; i < tabooWords[forTargetIndex].length; i++) {
        if (!validateInputEntry(tabooWords[forTargetIndex][i]).isValid) {
          inValidIndexes.push(i);
          inValidTabooWords.push(tabooWords[forTargetIndex][i]);
        }
      }
      if (inValidIndexes.length > 0) {
        const invalidItems = zip(inValidIndexes, inValidTabooWords);
        messages[forTargetIndex] =
          `Some taboo words (${invalidItems.map((i) => {
            return `[${(i[0] ?? 0) + 1}: ${(i[1]?.length ?? 0) > 0 ? i[1] : '<empty>'}]`;
          })}) are not valid, or you have empty input. Please change them. ` + INVALID_WORD_ERROR;
        errorIndexes[forTargetIndex] = inValidIndexes;
      } else {
        if (
          _.uniq(tabooWords[forTargetIndex].map(_.trim).map(_.toLower)).length <
          tabooWords[forTargetIndex].length
        ) {
          messages[forTargetIndex] = 'Please remove duplicate words in your taboo words.';
          errorIndexes[forTargetIndex] = [];
        } else {
          messages[forTargetIndex] = '';
          errorIndexes[forTargetIndex] = [];
        }
      }
    }
    setTabooWordsErrorMessages(messages);
    setTabooWordsErrorIndexs(errorIndexes);
  };

  const isAllValid = useMemo(() => {
    let _isAllValid;
    if (shouldUseAIForTabooWords) {
      _isAllValid =
        !topicNameErrorMessage &&
        topicName.length > 0 &&
        targetWordsErrorMessage.length <= 0 &&
        targetWords.length >= 3;
    } else {
      _isAllValid =
        !topicNameErrorMessage &&
        topicName.length > 0 &&
        targetWordsErrorMessage.length <= 0 &&
        tabooWordsErrorMessages.filter((w) => w.length > 0).length <= 0 &&
        targetWords.length >= 3 &&
        tabooWords.every((words) => words.length >= 5);
    }
    return _isAllValid;
  }, [
    shouldUseAIForTabooWords,
    topicNameErrorMessage,
    topicName,
    targetWordsErrorMessage,
    targetWords,
    tabooWordsErrorMessages,
    tabooWords,
  ]);

  const handleScrollToTop = () => {
    document.getElementById('add-topic-card')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onScrollChange = (e: React.UIEvent<HTMLDivElement>) => {
    const clientHeight = document.getElementById('add-topic-card')?.clientHeight;
    const scrollTop = e.currentTarget.scrollTop;
    if (clientHeight && scrollTop > clientHeight * 0.5) {
      !isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(true);
    } else {
      isScrollToTopButtonVisible && setIsScrollToTopButtonVisible(false);
    }
  };

  const openAppeal = (forTarget: string) => {
    setselectedWordForAppeal(forTarget);
    setIsAppealModalOpen(true);
  };

  const submitAppeal = async (forTarget: string) => {
    validateAppealReason(appealReasons);
    if (appealReasons.length <= 0 || !user?.email) return;
    setIsSubmittingAppeal(true);
    try {
      await sendEmail(
        '',
        user.email,
        appealReasons,
        `Taboo AI Taboo Words Appeal Request for [${forTarget}] from ${user.email}`
      );
      toast.success('Appeal submitted successfully! We will get in touch with you soon!');
      setAppealReasons('');
    } catch (error) {
      toast.error(
        'Sorry, something went wrong. We are unable to submit your appeal request. Please try again later!'
      );
      console.error(error);
    } finally {
      setIsSubmittingAppeal(false);
      setIsAppealModalOpen(false);
    }
  };

  const reset = () => {
    setTopicName('');
    setTopicNameErrorMessage('');
    setDifficultyLevel('1');
    setShouldUseAIForTabooWords(false);
    setTargetWords([]);
    setTabooWords([]);
    setTabooWordsCheckingStatus([]);
    setTabooWordsExistedStatus([]);
  };

  if (!user || status !== 'authenticated') {
    return <section className='flex h-full w-full items-center justify-center'></section>;
  }

  return (
    <main className='flex flex-col items-center gap-4 p-4'>
      {isScrollToTopButtonVisible && (
        <IconButton
          className='fixed bottom-8 right-8 z-40 animate-fade-in'
          tooltip='Scroll to top'
          onClick={handleScrollToTop}
        >
          <ChevronsUp />
        </IconButton>
      )}
      <Card
        id='add-topic-card'
        className={`relative w-full flex-grow overflow-y-scroll border-2 leading-snug transition-transform scrollbar-hide ${
          isAllValid ? 'border-green-500' : 'border-primary'
        }`}
        onScroll={onScrollChange}
      >
        <CardContent className='p-6 pt-2'>
          <div className='mt-2 text-sm leading-snug text-muted-foreground'>
            You can create your custom topics here! Fill up the fields below and submit your topics.
            Your topic will be reviewed and uploaded to Taboo AI within 3 working days!{' '}
            <span>
              <InfoButton
                size={15}
                tooltip='Read About Taboo AI Content Policy'
                title='Taboo AI Content Policy'
                description='Taboo AI, our innovative web application, is designed to
                    ensure a safe and respectful user experience for everyone.
                    As part of our commitment to maintaining a positive online
                    environment, all content submitted by users will be
                    carefully reviewed. Any content found to be explicit,
                    offensive, sexually explicit, violent, discriminatory, or
                    harmful in nature will be automatically filtered and
                    prevented from being uploaded. By implementing these
                    measures, we aim to create a platform where users can freely
                    express themselves while upholding a responsible and
                    respectful community.'
              />
            </span>
          </div>
          <div className='mt-4 flex flex-col gap-1'>
            <Label className='text-lg' htmlFor='input-topicName'>
              1. Topic name
            </Label>
            <div className='relative w-full'>
              <Input
                id='input-topicName'
                className={cn(
                  topicNameErrorMessage.length > 0
                    ? '!border-red-500'
                    : topicName.length > 0
                      ? '!border-green-500'
                      : '!border-border',
                  'w-full pr-[40px]'
                )}
                value={topicName}
                placeholder='Name for your topic...'
                onChange={onTopicNameChange}
              />
              {!topicNameErrorMessage && topicName.length > 0 && (
                <SpellCheck
                  className='absolute right-2 top-0 h-full'
                  size={30}
                  strokeWidth={1.5}
                  color='green'
                />
              )}
            </div>
            {topicNameErrorMessage && (
              <p className='my-1 animate-fade-in text-xs text-red-500'>{topicNameErrorMessage}</p>
            )}
            <Separator className='mb-1 mt-2' />
            <Label className='text-lg'>2. Assess the difficulty level for your topic</Label>
            <RadioGroup
              onValueChange={setDifficultyLevel}
              value={difficultyLevel}
              className='flex flex-row items-center gap-2'
            >
              <div className='flex flex-row items-center gap-2'>
                <RadioGroupItem id='diff-1' value='1' />
                <Label htmlFor='diff-1'>Easy</Label>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <RadioGroupItem id='diff-2' value='2' />
                <Label htmlFor='diff-2'>Medium</Label>
              </div>
              <div className='flex flex-row items-center gap-2'>
                <RadioGroupItem id='diff-3' value='3' />
                <Label htmlFor='diff-3'>Hard</Label>
              </div>
            </RadioGroup>
            <Separator className='mb-1 mt-2' />
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center justify-between'>
                <Label className='mt-2 text-lg text-primary' htmlFor='ai-switch'>
                  3. Use AI to generate taboo words for each target word?
                </Label>
                <Switch
                  id='ai-switch'
                  checked={shouldUseAIForTabooWords}
                  onCheckedChange={(checked) => {
                    setShouldUseAIForTabooWords(checked);
                  }}
                />
              </div>
              <p className='text-sm leading-tight text-muted-foreground'>
                If turned on, you are not required to create taboo words for each target word that
                you created. After submission, if your submission passes the review, we will use AI
                to create the taboo words for you.
              </p>
            </div>
            <Separator className='mb-1 mt-2' />
            <Label className='text-lg'>
              4. Give at least 3 target words relevant to the topic provided
            </Label>
            {targetWordsErrorMessage && (
              <p className='animate-fade-in text-xs text-red-500'>{targetWordsErrorMessage}</p>
            )}
            <div className='my-4 flex w-full flex-row flex-wrap items-center justify-start gap-4'>
              {targetWords.map((w, i) => (
                <div key={i} className='relative w-full lg:w-52'>
                  <Input
                    autoFocus
                    disabled={tabooWordsCheckingStatus[i]}
                    id={`target-input-${i}`}
                    className={cn(
                      'w-full pr-[40px]',
                      targetWordsErrorIndexs.includes(i) || w.length <= 0
                        ? '!border-red-500'
                        : targetWordsErrorMessage.length > 0
                          ? '!border-yellow-500'
                          : '!border-green-500'
                    )}
                    value={w}
                    placeholder='target word...'
                    onChange={(e) => {
                      changeTargetWordAtIndex(e.target.value, i);
                    }}
                    onBlur={() => {
                      onTargetWordInputOutOfFocus(w);
                    }}
                  />
                  <IconButton
                    asChild
                    tooltip='Delete'
                    disabled={tabooWordsCheckingStatus[i]}
                    className='absolute -right-3 -top-4 z-10 rounded-full p-2 shadow-sm'
                    aria-label={`delete this target word with index ${i}`}
                    variant='destructive'
                    onClick={() => {
                      deleteTargetWordAtIndex(i);
                    }}
                  >
                    <Trash size={15} />
                  </IconButton>
                </div>
              ))}
              {targetWords.length < MAX_TARGET_WORDS_COUNT && (
                <IconButton
                  asChild
                  tooltip='Add target word'
                  key='add-button'
                  aria-label='add a new target word'
                  onClick={addNewTargetWord}
                >
                  <Plus />
                </IconButton>
              )}
            </div>
            {!shouldUseAIForTabooWords && (
              <>
                <Separator className='mb-1 mt-2' />
                <Label className='text-lg'>
                  5. For each target word, define at least 5 taboo words
                </Label>
                <Accordion
                  type='single'
                  collapsible
                  onValueChange={(value) => {
                    setExpandedAccItem(value);
                    const expandedIndex = Number(value);
                    if (expandedIndex < 0) {
                      setTabooWordsCheckingStatus(Array(targetWords.length).fill(false));
                    } else if (
                      tabooWordsExistedStatus[expandedIndex] === null ||
                      (tabooWordsExistedStatus[expandedIndex] === true &&
                        tabooWords[expandedIndex].length === 0)
                    ) {
                      checkIfTabooWordsExistedForTarget(expandedIndex);
                    }
                  }}
                >
                  {targetWords.map((w, i) =>
                    w.length > 0 ? (
                      <AccordionItem
                        key={i}
                        value={String(i)}
                        disabled={tabooWordsCheckingStatus.some((s) => s)}
                      >
                        <AccordionTrigger>
                          <div>
                            Target Word:{' '}
                            <b
                              className={`${
                                tabooWordsErrorMessages[i].length > 0
                                  ? 'text-red-500'
                                  : 'text-green-500'
                              }`}
                            >
                              {w}
                            </b>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent key={i} className='px-4'>
                          {tabooWordsCheckingStatus[i] ? (
                            <Skeleton numberOfRows={2} />
                          ) : (
                            <div>
                              {tabooWordsExistedStatus[i] && (
                                <div className='text-primary'>
                                  <span>
                                    Taboo words for &quot;{w}&quot; have already been defined in our
                                    system by others. In order to respect the contents created by
                                    other players, we are sorry to tell you that you will not be
                                    able to edit the taboo words here. However, you can still appeal
                                    if you insist on changing. Appeal will be reviewed in
                                    case-by-case basis.{' '}
                                  </span>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <IconButton
                                        tooltip='How to appeal?'
                                        className='!m-0 !w-fit !p-0'
                                        variant='link'
                                      >
                                        <Info size={12} />
                                      </IconButton>
                                    </PopoverTrigger>
                                    <PopoverContent className='bg-card text-card-foreground'>
                                      <h4 className='mb-4'>How to appeal?</h4>
                                      <Button
                                        disabled={!user || !user.email}
                                        onClick={() => {
                                          openAppeal(w);
                                        }}
                                      >
                                        {user && user.email
                                          ? 'Click to submit your appeal'
                                          : 'Sorry, you are not eligible for appeal submission.'}
                                      </Button>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              )}
                              {tabooWordsErrorMessages[i] && (
                                <p className='animate-fade-in text-xs text-red-500'>
                                  {tabooWordsErrorMessages[i]}
                                </p>
                              )}

                              <div className='my-4 flex w-full flex-row flex-wrap items-center justify-start gap-4'>
                                {tabooWords[i].map((tw, ti) => (
                                  <div key={`taboo-${ti}`} className='relative w-full lg:w-52'>
                                    <Input
                                      autoFocus
                                      disabled={tabooWordsExistedStatus[i] ?? false}
                                      id={`taboo-${i}-${ti}`}
                                      key={`taboo-${i}-${ti}`}
                                      className={`w-full ${
                                        tabooWordsErrorIndexs[i].includes(ti) || tw.length <= 0
                                          ? '!border-red-500'
                                          : tabooWordsErrorMessages[i].length > 0
                                            ? '!border-yellow-500'
                                            : '!border-green-500'
                                      }`}
                                      value={tw}
                                      placeholder='taboo word...'
                                      onChange={(e) => {
                                        changeTabooWordAtIndex(e.target.value, i, ti);
                                      }}
                                      onBlur={() => {
                                        onTabooWordInputOutOfFocus(i, tw);
                                      }}
                                    />
                                    {!(tabooWordsExistedStatus[i] ?? false) && (
                                      <>
                                        <IconButton
                                          asChild
                                          tooltip='Delete'
                                          disabled={tabooWordsCheckingStatus[i]}
                                          className='absolute -right-3 -top-4 z-10 rounded-full p-2 shadow-sm'
                                          hidden={tabooWordsExistedStatus[i] ?? false}
                                          variant='destructive'
                                          aria-label={`delete this target word with index ${i}`}
                                          onClick={() => {
                                            deleteTabooWordAtIndex(i, ti);
                                          }}
                                        >
                                          <Trash size={15} />
                                        </IconButton>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </div>
                              {!(tabooWordsExistedStatus[i] ?? false) &&
                                tabooWords[i].length < MAX_TABOO_WORDS_COUNT && (
                                  <IconButton
                                    asChild
                                    tooltip='Add target word'
                                    key='add-button'
                                    aria-label='add a new target word'
                                    onClick={() => {
                                      addNewTabooWord(i);
                                    }}
                                  >
                                    <Plus />
                                  </IconButton>
                                )}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ) : (
                      <></>
                    )
                  )}
                </Accordion>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {isAllValid && (
        <Button
          disabled={!user || !user.email}
          className='animate-fade-in'
          aria-label='click to review the topic'
          onClick={onReviewTopic}
        >
          {user && user.email ? 'Review Your Topic' : 'You need to login to proceed'}
        </Button>
      )}
      <TopicReviewSheet
        user={user}
        defaultNickname={user.nickname ?? user.name ?? ''}
        difficultyLevel={difficultyLevel}
        open={reviewSheetOpen}
        onOpenChange={(open) => {
          setReviewSheetOpen(open);
        }}
        shouldUseAIForTabooWords={shouldUseAIForTabooWords}
        topicName={topicName}
        targetWords={targetWords}
        tabooWords={tabooWords}
        onTopicSubmitted={reset}
      />
      <Dialog
        open={isAppealModalOpen}
        onOpenChange={(open) => {
          setIsAppealModalOpen(open);
        }}
      >
        <DialogContent className='rounded-lg bg-card leading-snug text-card-foreground'>
          <DialogHeader className='text-primary'>
            <DialogTitle> Submit Appeal For &quot;{selectedWordForAppeal}&quot;</DialogTitle>
          </DialogHeader>
          {user?.email && <Input disabled defaultValue={user.email} />}
          <Textarea
            value={appealReasons}
            placeholder='Appeal reasons.'
            onChange={onAppealReasonChange}
          />
          <DialogFooter>
            {isSubmittingAppeal ? (
              <Button disabled>
                <Spinner />
              </Button>
            ) : (
              <Button
                disabled={appealReasons.length <= 0 || appealReasonErrorMessage.length > 0}
                onClick={() => {
                  submitAppeal(selectedWordForAppeal);
                }}
              >
                Submit Appeal
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default AddLevelPage;
