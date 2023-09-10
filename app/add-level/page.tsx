'use client';

import _ from 'lodash';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { sendEmail } from '@/lib/services/emailService';
import { addLevel } from '@/lib/services/levelService';
import { addTabooWords, getTabooWords } from '@/lib/services/wordService';
import { useAuth } from '../../components/auth-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import IconButton from '@/components/ui/icon-button';
import { ChevronsUp, Info, Plus, SpellCheck, Trash, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/custom/spinner';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/custom/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { InfoButton } from '@/components/custom/info-button';
import { Separator } from '@/components/ui/separator';
import { updateUserFromUser } from '@/lib/services/userService';

const CHARACTER_LIMIT = 50;
const MAX_TARGET_WORDS_COUNT = 10;
const MAX_TABOO_WORDS_COUNT = 10;
const VALID_WORD_REGEX = /\s*(\w+[\s']?)+/;
const INVALID_WORD_ERROR =
  'Only single space or a single quotation mark is allowed between words. No special characters are allowed. Cannot be empty.';

const AddLevelPage = () => {
  const { user, status } = useAuth();
  const [reviewSheetOpen, setReviewSheetOpen] = useState(false);
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const [topicName, setTopicName] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('1');
  const [shouldUseAIForTabooWords, setShouldUseAIForTabooWords] =
    useState(true);
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [tabooWords, setTabooWords] = useState<string[][]>([]);
  const [tabooWordsCheckingStatus, setTabooWordsCheckingStatus] = useState<
    boolean[]
  >([]);
  const [tabooWordsExistedStatus, setTabooWordsExistedStatus] = useState<
    (boolean | null)[]
  >([]);
  const [topicNameErrorMessage, setTopicNameErrorMessage] = useState('');
  const [targetWordsErrorMessage, setTargetWordsErrorMessage] = useState('');
  const [targetWordsErrorIndexs, setTargetWordsErrorIndexs] = useState<
    number[]
  >([]);
  const [tabooWordsErrorMessages, setTabooWordsErrorMessages] = useState<
    string[]
  >([]);
  const [tabooWordsErrorIndexs, setTabooWordsErrorIndexs] = useState<
    number[][]
  >([]);
  const [isCreatingLevel, setisCreatingLevel] = useState(false);
  const [nickname, setNickname] = useState('');

  //ANCHOR - States for appeal
  const [selectedWordForAppeal, setselectedWordForAppeal] = useState('');
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealReasons, setAppealReasons] = useState('');
  const [appealReasonErrorMessage, setAppealReasonErrorMessage] = useState('');

  //ANCHOR - States for component control
  const [expandedAccItem, setExpandedAccItem] = useState<string>('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      toast({
        title: 'You need to sign in to contribute a topic',
      });
      router.push('/');
    }
  }, [status]);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname ?? user.name ?? '');
    }
  }, [user]);

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
    setAppealReasonErrorMessage(
      reason.length <= 0 ? 'Reason cannot be empty!' : ''
    );
  };

  const checkIfTabooWordsExistedForTarget = async (targetWordIndex: number) => {
    const statuses = [...tabooWordsCheckingStatus];
    statuses[targetWordIndex] = true;
    setTabooWordsCheckingStatus(statuses);
    try {
      const taboo = await getTabooWords(targetWords[targetWordIndex]);
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
    document
      .getElementById(`target-input-${finalIndex}`)
      ?.scrollIntoView({ behavior: 'smooth' });
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

  const onTabooWordInputOutOfFocus = (
    forTargetAtIndex: number,
    tabooWord: string
  ) => {
    const result = validateInputEntry(tabooWord);
    if (
      !result.isValid &&
      tabooWordsErrorMessages[forTargetAtIndex].length === 0
    ) {
      const tabooErrors = [...tabooWordsErrorMessages];
      tabooErrors[forTargetAtIndex] = result.message;
      setTabooWordsErrorMessages(tabooErrors);
    }
  };

  const deleteTabooWordAtIndex = (
    forTargetAtIndex: number,
    forTabooAtIndex: number
  ) => {
    const words = [...tabooWords];
    words[forTargetAtIndex].splice(forTabooAtIndex, 1);
    setTabooWords(words);
  };

  const validateTargetWords = () => {
    if (targetWords.filter((w) => w.length > 0).length < 3) {
      setTargetWordsErrorMessage(
        'You need to create at least 3 target words for the topic.'
      );
      setTargetWordsErrorIndexs([]);
      return;
    }
    const invalidTargetIndexs: number[] = [];
    // Check valid word
    for (let i = 0; i < targetWords.length; i++) {
      if (!validateInputEntry(targetWords[i]).isValid) {
        invalidTargetIndexs.push(i);
      }
    }
    if (invalidTargetIndexs.length > 0) {
      setTargetWordsErrorMessage(
        'Some target words input are not valid or empty. Please change them! ' +
          INVALID_WORD_ERROR
      );
      setTargetWordsErrorIndexs(invalidTargetIndexs);
      return;
    }

    if (
      _.uniq(targetWords.map(_.trim).map(_.toLower)).length < targetWords.length
    ) {
      setTargetWordsErrorMessage(
        'Please remove duplicate in your target words!'
      );
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
      messages[
        forTargetIndex
      ] = `You need to create at least 5 taboo words for "${targetWords[forTargetIndex]}".`;
      errorIndexes[forTargetIndex] = [];
    } else {
      const inValidIndexes = [];
      for (let i = 0; i < tabooWords[forTargetIndex].length; i++) {
        if (!validateInputEntry(tabooWords[forTargetIndex][i]).isValid) {
          inValidIndexes.push(i);
        }
      }
      if (inValidIndexes.length > 0) {
        messages[forTargetIndex] =
          'Some taboo words input are not valid. Please change them! ' +
          INVALID_WORD_ERROR;
        errorIndexes[forTargetIndex] = inValidIndexes;
      } else {
        if (
          _.uniq(tabooWords[forTargetIndex].map(_.trim).map(_.toLower)).length <
          tabooWords[forTargetIndex].length
        ) {
          messages[forTargetIndex] =
            'Please remove duplicate words in your taboo words.';
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
    let _isAllValid = false;
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

  const submitNewTopic = async () => {
    setisCreatingLevel(true);
    try {
      await addLevel({
        name: topicName,
        difficulty: Number(difficultyLevel),
        words: targetWords.map((w) => _.toLower(_.trim(w))),
        author: nickname,
        authorEmail: user?.email,
        isNew: true,
      });
      user?.email &&
        (await updateUserFromUser({
          email: user.email,
          nickname: nickname,
        }));
      if (!shouldUseAIForTabooWords)
        for (let i = 0; i < tabooWords.length; i++) {
          const wordList = tabooWords[i];
          const targetWord = targetWords[i];
          await addTabooWords(targetWord, wordList, false, user?.email);
        }

      await sendMyselfEmail();
      reset();
      toast({
        title:
          'Your topic has been submitted for review. The outcome of the submission will be notified via email.',
      });
    } catch (error) {
      toast({
        title: 'Sorry, we are unable to submit the topic at the moment!',
        variant: 'destructive',
      });
      console.error(error);
    } finally {
      setisCreatingLevel(false);
      setReviewSheetOpen(false);
    }
  };

  const sendMyselfEmail = async () => {
    if (user?.email) {
      const email = user.email;
      const name = nickname || 'anonymous';
      try {
        await sendEmail(
          name,
          email,
          `${email} has submitted a new topic!`,
          `Taboo AI New Topic Submission: ${email} has submitted a new topic!`,
          `<article>
        <h1>New Topic Submitted: <b>${topicName}</b></h1>
        <div>
            <p>Nickname: ${name}</p>
            <p>Email: ${email}</p>
            <p>Topic Name: <b>${topicName}</b></p>
        </div>
        <br/>
        ${targetWords.map(
          (w, i) => `
          <hr/>
          <h2>Target: ${w}</h2>
          <h3>Difficulty Level: ${difficultyLevel}</h3>
          ${
            shouldUseAIForTabooWords
              ? '<div>This user has opted in for AI to generate taboo words.</div>'
              : tabooWords[i].map((tw) => `<div>${tw}</div>`)
          }
        `
        )}
        </article>`
        );
      } catch (error) {
        console.error(error);
      }
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
      toast({
        title:
          'Appeal submitted successfully! We will get in touch with you soon!',
      });
      setAppealReasons('');
    } catch (error) {
      toast({
        title:
          'Sorry, something went wrong. We are unable to submit your appeal request. Please try again later!',
        variant: 'destructive',
      });
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
    return (
      <section className='w-full h-full flex justify-center items-center'></section>
    );
  }

  return (
    <div className='w-full h-full flex flex-col gap-4 items-center p-4 pt-16'>
      {isScrollToTopButtonVisible && (
        <IconButton
          className='fixed bottom-8 right-8 animate-fade-in z-40'
          tooltip='Scroll to top'
          onClick={handleScrollToTop}
        >
          <ChevronsUp />
        </IconButton>
      )}
      <Card
        id='add-topic-card'
        className={`relative w-full flex-grow transition-transform overflow-y-scroll scrollbar-hide leading-snug border-2 ${
          isAllValid ? 'border-green-500' : 'border-primary'
        }`}
        onScroll={onScrollChange}
      >
        <CardContent className='p-6 pt-2'>
          <p className='leading-snug text-sm mt-2 text-muted-foreground'>
            You can create your custom topics here! Fill up the fields below and
            submit your topics. Your topic will be reviewed and uploaded to
            Taboo AI within 3 working days!{' '}
            <InfoButton
              className='!w-[20px] !h-[20px]'
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
          </p>
          <div className='flex flex-col gap-1 mt-4'>
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
                  'pr-[40px] w-full'
                )}
                value={topicName}
                placeholder='Name for your topic...'
                onChange={onTopicNameChange}
              />
              {!topicNameErrorMessage && topicName.length > 0 && (
                <SpellCheck
                  className='absolute h-full right-2 top-0'
                  size={30}
                  strokeWidth={1.5}
                  color='green'
                />
              )}
            </div>
            {topicNameErrorMessage && (
              <p className='text-red-500 text-xs my-1 animate-fade-in'>
                {topicNameErrorMessage}
              </p>
            )}
            <Separator className='mt-2 mb-1' />
            <Label className='text-lg'>
              2. Assess the difficulty level for your topic
            </Label>
            <RadioGroup
              onValueChange={setDifficultyLevel}
              value={difficultyLevel}
              className='flex flex-row gap-2 items-center'
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
            <Separator className='mt-2 mb-1' />
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center justify-between'>
                <Label
                  className='mt-2 text-lg text-primary'
                  htmlFor='ai-switch'
                >
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
              <p className='text-muted-foreground text-sm leading-tight'>
                If turned on, you are not required to create taboo words for
                each target word that you created. After submission, if your
                submission passes the review, we will use AI to create the taboo
                words for you.
              </p>
            </div>
            <Separator className='mt-2 mb-1' />
            <Label className='text-lg'>
              4. Give at least 3 target words relevant to the topic provided
            </Label>
            {targetWordsErrorMessage && (
              <p className='text-red-500 text-xs animate-fade-in'>
                {targetWordsErrorMessage}
              </p>
            )}
            <div className='flex flex-row flex-wrap gap-4 justify-start items-center w-full my-4'>
              {targetWords.map((w, i) => (
                <div key={i} className='w-full lg:w-52 relative'>
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
                    tooltip='Delete'
                    disabled={tabooWordsCheckingStatus[i]}
                    className='rounded-full shadow-sm absolute -top-4 -right-3 z-10 p-2'
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
                <Separator className='mt-2 mb-1' />
                <Label className='text-lg'>
                  5. For each target word, define at least 5 taboo words
                </Label>
                <Accordion
                  type='single'
                  collapsible
                  onValueChange={(value) => {
                    console.log(value);
                    setExpandedAccItem(value);
                    const expandedIndex = Number(value);
                    if (expandedIndex < 0) {
                      setTabooWordsCheckingStatus(
                        Array(targetWords.length).fill(false)
                      );
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
                        disabled={tabooWordsCheckingStatus.some(
                          (s) => s === true
                        )}
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
                                    Taboo words for &quot;{w}&quot; have already
                                    been defined in our system by others. In
                                    order to respect the contents created by
                                    other players, we are sorry to tell you that
                                    you will not be able to edit the taboo words
                                    here. However, you can still appeal if you
                                    insist on changing. Appeal will be reviewed
                                    in case-by-case basis.{' '}
                                  </span>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <IconButton
                                        tooltip='How to appeal?'
                                        className='!p-0 !m-0 !w-fit'
                                        variant='link'
                                      >
                                        <Info size={12} />
                                      </IconButton>
                                    </PopoverTrigger>
                                    <PopoverContent className='text-card-foreground bg-card'>
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
                                <p className='text-red-500 text-xs animate-fade-in'>
                                  {tabooWordsErrorMessages[i]}
                                </p>
                              )}

                              <div className='flex flex-row flex-wrap gap-4 justify-start items-center w-full my-4'>
                                {tabooWords[i].map((tw, ti) => (
                                  <div
                                    key={`taboo-${ti}`}
                                    className='w-full lg:w-52 relative'
                                  >
                                    <Input
                                      autoFocus
                                      disabled={
                                        tabooWordsExistedStatus[i] ?? false
                                      }
                                      id={`taboo-${i}-${ti}`}
                                      key={`taboo-${i}-${ti}`}
                                      className={`w-full ${
                                        tabooWordsErrorIndexs[i].includes(ti) ||
                                        tw.length <= 0
                                          ? '!border-red-500'
                                          : tabooWordsErrorMessages[i].length >
                                            0
                                          ? '!border-yellow-500'
                                          : '!border-green-500'
                                      }`}
                                      value={tw}
                                      placeholder='taboo word...'
                                      onChange={(e) => {
                                        changeTabooWordAtIndex(
                                          e.target.value,
                                          i,
                                          ti
                                        );
                                      }}
                                      onBlur={() => {
                                        onTabooWordInputOutOfFocus(i, tw);
                                      }}
                                    />
                                    {!(tabooWordsExistedStatus[i] ?? false) && (
                                      <>
                                        <IconButton
                                          tooltip='Delete'
                                          disabled={tabooWordsCheckingStatus[i]}
                                          className='rounded-full shadow-sm absolute -top-4 -right-3 z-10 p-2'
                                          hidden={
                                            tabooWordsExistedStatus[i] ?? false
                                          }
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
                                tabooWords[i].length <
                                  MAX_TABOO_WORDS_COUNT && (
                                  <IconButton
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
        <Sheet
          open={reviewSheetOpen}
          onOpenChange={(open) => {
            setReviewSheetOpen(open);
          }}
        >
          <SheetTrigger asChild>
            <Button
              disabled={!user || !user.email}
              className='animate-fade-in'
              aria-label='click to review the topic'
              onClick={onReviewTopic}
            >
              {user && user.email
                ? 'Review Your Topic'
                : 'You need to login to proceed'}
            </Button>
          </SheetTrigger>
          <SheetContent
            side='bottom'
            className='leading-snug h-full overflow-y-auto'
          >
            <SheetHeader>
              <SheetTitle className='flex flex-col gap-1 justify-center'>
                Review Your Topic:{' '}
                <b className='ml-2 text-2xl font-extrabold'>{topicName}</b>
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-wrap gap-8 mt-4 justify-center'>
              {targetWords.map((w, i) => (
                <Card key={i} className='max-w-[300px]'>
                  <CardHeader className='text-center text-2xl font-bold p-2'>
                    <CardTitle className='bg-secondary py-4 rounded-lg shadow-md'>
                      {_.startCase(_.trim(w))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='text-center mt-2'>
                    {shouldUseAIForTabooWords ? (
                      <p>
                        You chose to use AI to generate the taboo words. Your
                        taboo words will be ready once the submission passes the
                        review.
                      </p>
                    ) : (
                      <>
                        <p className='text-red-400'>Taboo Words:</p>
                        <div className='flex flex-wrap gap-4 mt-4'>
                          {tabooWords[i]
                            .filter((w) => w.length > 0)
                            .map((tw, ti) => (
                              <Badge key={ti}>{tw}</Badge>
                            ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {user?.email && (
              <div className='flex flex-col gap-2 my-4'>
                <Label htmlFor='email-input'>Contributor email: </Label>
                <Input disabled id='email-input' defaultValue={user.email} />
              </div>
            )}
            <div className='flex flex-col gap-2 my-4'>
              <Label htmlFor='nickname-input'>Nickname: </Label>
              <Input
                id='nickname-input'
                value={nickname}
                maxLength={20}
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
                className={cn(
                  _.trim(nickname).length <= 0
                    ? '!border-red-500'
                    : '!border-border'
                )}
              />
              <p className='text-muted-foreground text-xs'>
                Nickname will be displayed under the successfully contributed
                topic and visible to all players.
              </p>
            </div>
            <div className='flex justify-center'>
              {isCreatingLevel ? (
                <Button disabled>
                  <Spinner />
                </Button>
              ) : (
                <Button
                  disabled={
                    !user || !user.email || _.trim(nickname).length <= 0
                  }
                  className='mb-4'
                  aria-label='click to submit the topic created'
                  onClick={submitNewTopic}
                >
                  {user && user.email
                    ? 'Submit Topic'
                    : 'Please login to proceed'}
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
      <Dialog
        open={isAppealModalOpen}
        onOpenChange={(open) => {
          setIsAppealModalOpen(open);
        }}
      >
        <DialogContent className='leading-snug bg-card text-card-foreground rounded-lg'>
          <DialogHeader className='text-primary'>
            <DialogTitle>
              {' '}
              Submit Appeal For &quot;{selectedWordForAppeal}&quot;
            </DialogTitle>
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
                disabled={
                  appealReasons.length <= 0 ||
                  appealReasonErrorMessage.length > 0
                }
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
    </div>
  );
};

export default AddLevelPage;
