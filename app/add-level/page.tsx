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
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Button,
  useDisclosure,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  SimpleGrid,
  CardHeader,
  Flex,
  Tag,
  RadioGroup,
  Radio,
  Switch,
  Spinner,
  SkeletonText,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverHeader,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
} from '@chakra-ui/react';
import _ from 'lodash';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { BsInfoSquareFill } from 'react-icons/bs';
import { FiArrowUp, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import { RiAddFill } from 'react-icons/ri';
import useToast from '../../lib/hook/useToast';
import { sendEmail } from '../../lib/services/frontend/emailService';
import {
  createLevel,
  getLevel,
} from '../../lib/services/frontend/levelService';
import {
  getVariations,
  saveVariations,
  wordExists,
} from '../../lib/services/frontend/wordService';
import { emailIsValid } from '../../lib/utilities';
import ILevel from '../../types/level.interface';
import IVariation from '../../types/variation.interface';

const AddLevelPage = () => {
  const CHARACTER_LIMIT = 50;
  const MAX_TARGET_WORDS_COUNT = 10;
  const [isScrollToTopButtonVisible, setIsScrollToTopButtonVisible] =
    useState(false);
  const [topicName, setTopicName] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('1');
  const [shouldUseAIForTabooWords, setShouldUseAIForTabooWords] =
    useState(false);
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
  const [tabooWordsErrorMessages, setTabooWordsErrorMessages] = useState<
    string[]
  >([]);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [isCreatingLevel, setisCreatingLevel] = useState(false);
  const [isTopicNameValid, setIsTopicNameValid] = useState<
    boolean | undefined
  >();
  const [isCheckingTopicName, setIsCheckingTopicName] = useState(false);
  const [nickname, setNickname] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  //ANCHOR - States for appeal
  const [selectedWordForAppeal, setselectedWordForAppeal] = useState('');
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(false);
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false);
  const [appealEmail, setAppealEmail] = useState('');
  const [appealReasons, setAppealReasons] = useState('');
  const [appealEmailErrorMessage, setAppealEmailErrorMessage] = useState('');
  const [appealReasonErrorMessage, setAppealReasonErrorMessage] = useState('');

  //ANCHOR - States for component control
  const [
    controlledAccordianExpandedIndex,
    setControlledAccordianExpandedIndex,
  ] = useState<number>(-1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { toast } = useToast();

  useEffect(() => {
    validateTargetWords();
  }, [targetWords]);

  const onTopicNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > CHARACTER_LIMIT) return;
    setIsTopicNameValid(undefined);
    setTopicName(e.target.value);
    if (e.target.value.length === 0) {
      setTopicNameErrorMessage('Topic name cannot be empty!');
      setIsTopicNameValid(false);
    }
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailAddress(e.target.value);
    validateEmail(e.target.value);
  };

  const onAppealEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAppealEmail(e.target.value);
    validateAppealEmail(e.target.value);
  };

  const validateAppealEmail = (email: string) => {
    if (email.length <= 0) {
      setAppealEmailErrorMessage('Email is required');
    } else if (!emailIsValid(email)) {
      setAppealEmailErrorMessage('Invalid email address');
    } else {
      setAppealEmailErrorMessage('');
    }
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

  const validateEmail = (email: string) => {
    if (email.length <= 0) {
      setEmailErrorMessage('Email is required');
    } else if (!emailIsValid(email)) {
      setEmailErrorMessage('Invalid email address');
    } else {
      setEmailErrorMessage('');
    }
  };

  const onTopicOutofFocus = async () => {
    if (topicName.length <= 0) return;
    setIsCheckingTopicName(true);
    try {
      const level = await getLevel(topicName);
      if (level !== null) {
        setIsTopicNameValid(false);
        setTopicNameErrorMessage(
          'This topic name has already existed. Please change to another topic name.'
        );
      } else {
        setIsTopicNameValid(true);
        setTopicNameErrorMessage('');
      }
    } finally {
      setIsCheckingTopicName(false);
    }
  };

  const checkIfTabooWordsExistedForTarget = async (targetWordIndex: number) => {
    const statuses = [...tabooWordsCheckingStatus];
    statuses[targetWordIndex] = true;
    setTabooWordsCheckingStatus(statuses);
    try {
      const existed = await wordExists(targetWords[targetWordIndex]);
      const existedStatues = [...tabooWordsExistedStatus];
      existedStatues[targetWordIndex] = existed;
      setTabooWordsExistedStatus(existedStatues);
      if (existed) {
        const existingTabooWords = await getVariations(
          targetWords[targetWordIndex]
        );
        const _tabooWords = [...tabooWords];
        _tabooWords[targetWordIndex] = existingTabooWords;
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
    const currentTabooWordLength = targetWords.length;
    setTargetWords((w) => [...w, '']);
    setTabooWords((w) => [...w, []]);
    setTabooWordsErrorMessages((m) => [...m, '']);
    setTabooWordsCheckingStatus((c) => [...c, false]);
    setTabooWordsExistedStatus((e) => [...e, null]);
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
    if (controlledAccordianExpandedIndex === index) {
      setControlledAccordianExpandedIndex(-1);
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
    if (controlledAccordianExpandedIndex === index) {
      setControlledAccordianExpandedIndex(-1);
    }
  };

  const clearTargetWordInputAtIndex = (index: number) => {
    const words = [...targetWords];
    words[index] = '';
    setTargetWords(words);
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
    if (changeValue.length > CHARACTER_LIMIT) return;
    const words = [...tabooWords];
    words[forTargetAtIndex][forTabooAtIndex] = changeValue;
    setTabooWords(words);
    validateTabooWords(forTargetAtIndex);
  };

  const deleteTabooWordAtIndex = (
    forTargetAtIndex: number,
    forTabooAtIndex: number
  ) => {
    const words = [...tabooWords];
    words[forTargetAtIndex].splice(forTabooAtIndex, 1);
    setTabooWords(words);
  };

  const clearTabooWordInputAtIndex = (
    forTargetAtIndex: number,
    forTabooAtIndex: number
  ) => {
    const words = [...tabooWords];
    words[forTargetAtIndex][forTabooAtIndex] = '';
    setTabooWords(words);
  };

  const validateTargetWords = () => {
    if (targetWords.filter((w) => w.length > 0).length < 3) {
      setTargetWordsErrorMessage(
        'You need to create at least 3 target words for the topic.'
      );
    } else {
      setTargetWordsErrorMessage('');
    }
  };

  const validateTabooWords = (forTargetIndex: number) => {
    const messages = [...tabooWordsErrorMessages];
    if (tabooWords[forTargetIndex].filter((w) => w.length > 0).length < 5) {
      messages[
        forTargetIndex
      ] = `You need to create at least 5 taboo words for "${targetWords[forTargetIndex]}".`;
    } else {
      messages[forTargetIndex] = '';
    }
    setTabooWordsErrorMessages(messages);
  };

  const isAllValid = (): boolean => {
    if (shouldUseAIForTabooWords) {
      return (
        isTopicNameValid === true &&
        topicName.length > 0 &&
        targetWordsErrorMessage.length <= 0
      );
    } else {
      return (
        isTopicNameValid === true &&
        topicName.length > 0 &&
        targetWordsErrorMessage.length <= 0 &&
        tabooWordsErrorMessages.filter((w) => w.length > 0).length <= 0
      );
    }
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

  const submitNewTopic = async () => {
    setisCreatingLevel(true);
    const level: ILevel = {
      name: topicName,
      difficulty: Number(difficultyLevel),
      author: nickname,
      new: true,
      words: targetWords.map((w) => _.lowerCase(w)),
      createdAt: Date.now(),
      isVerified: false,
    };
    try {
      await createLevel(level);
      if (!shouldUseAIForTabooWords)
        for (let i = 0; i < tabooWords.length; i++) {
          const wordList = tabooWords[i];
          const targetWord = targetWords[i];
          const variation: IVariation = {
            target: targetWord,
            variations: wordList,
          };
          await saveVariations(variation);
        }

      await sendMyselfEmail();
      reset();
      toast({
        title:
          'Your topic has been submitted for review. The outcome of the submission will be notified via email.',
        status: 'success',
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: 'Sorry, we are unable to submit the topic at the moment!',
        status: 'error',
      });
      console.error(error);
    } finally {
      setisCreatingLevel(false);
      onClose();
    }
  };

  const sendMyselfEmail = async () => {
    try {
      await sendEmail(
        nickname,
        emailAddress,
        `${emailAddress} has submitted a new topic!`,
        `Taboo AI New Topic Submission: ${emailAddress} has submitted a new topic!`,
        `<article>
      <h1>New Topic Submitted: <b>${topicName}</b></h1>
      <div>
          <p>Nickname: ${nickname}</p>
          <p>Email: ${emailAddress}</p>
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
  };

  const openAppeal = (forTarget: string) => {
    setselectedWordForAppeal(forTarget);
    setIsAppealModalOpen(true);
  };

  const submitAppeal = async (forTarget: string) => {
    validateAppealEmail(appealEmail);
    validateAppealReason(appealReasons);
    if (
      !(
        appealEmail.length > 0 &&
        appealReasons.length > 0 &&
        emailIsValid(appealEmail)
      )
    )
      return;
    setIsSubmittingAppeal(true);
    try {
      await sendEmail(
        '',
        appealEmail,
        appealReasons,
        `Taboo AI Taboo Words Appeal Request for [${forTarget}] from ${appealEmail}`
      );
      toast({
        title:
          'Appeal submitted successfully! We will get in touch with you soon!',
        status: 'success',
      });
      setAppealReasons('');
    } catch (error) {
      toast({
        title:
          'Sorry, something went wrong. We are unable to submit your appeal request. Please try again later!',
        status: 'error',
      });
      console.error(error);
    } finally {
      setIsSubmittingAppeal(false);
      setIsAppealModalOpen(false);
    }
  };

  const reset = () => {
    setTopicName('');
    setDifficultyLevel('1');
    setShouldUseAIForTabooWords(false);
    setTargetWords([]);
    setTabooWords([]);
    setTabooWordsCheckingStatus([]);
    setTabooWordsExistedStatus([]);
    setIsTopicNameValid(undefined);
  };

  return (
    <>
      <div className='relative w-full h-full flex flex-col items-center'>
        <Card
          id='add-topic-card'
          className={`relative w-[95%] h-full transition-transform mb-4 overflow-y-scroll scrollbar-hide bg-black-darker text-white leading-4 border-2 ${
            isAllValid() ? 'border-neon-green' : 'border-white'
          }`}
          onScroll={onScrollChange}
        >
          <Fade
            hidden={!isScrollToTopButtonVisible}
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
              <FormControl isInvalid={!isTopicNameValid}>
                <FormLabel
                  mb={0}
                  className={`text-bold text-lg ${
                    isTopicNameValid === true
                      ? 'text-neon-green'
                      : 'text-yellow'
                  }`}
                  htmlFor='input-topicName'
                >
                  1. Topic name
                </FormLabel>
                <FormErrorMessage mt={0}>
                  {topicNameErrorMessage}
                </FormErrorMessage>
                <InputGroup size='md' className='my-4'>
                  <Input
                    id='input-topicName'
                    className={`w-full ${
                      isTopicNameValid === true
                        ? '!border-neon-green'
                        : isTopicNameValid === false
                        ? '!border-red-light'
                        : '!border-white'
                    }`}
                    value={topicName}
                    placeholder='Name for your topic...'
                    pr='40px'
                    onChange={onTopicNameChange}
                    onBlur={onTopicOutofFocus}
                  />
                  <InputRightElement width='60px' height='40px'>
                    {isCheckingTopicName ? (
                      <Spinner />
                    ) : isTopicNameValid === true ? (
                      <FiCheck className='text-neon-green' />
                    ) : (
                      <></>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel
                  mb={0}
                  className={'text-bold text-lg text-neon-green'}
                >
                  2. Assess the difficulty level for your topic
                </FormLabel>
                <RadioGroup
                  onChange={setDifficultyLevel}
                  value={difficultyLevel}
                >
                  <Stack direction='row' mt={4}>
                    <Radio colorScheme='green' value='1'>
                      Easy
                    </Radio>
                    <Radio colorScheme='green' value='2'>
                      Medium
                    </Radio>
                    <Radio colorScheme='green' value='3'>
                      Hard
                    </Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>
              <FormControl
                isDisabled={tabooWordsCheckingStatus.some((s) => s === true)}
                display='flex'
                flexDirection='column'
                alignItems='start'
              >
                <FormLabel
                  className={'text-bold text-lg text-neon-green'}
                  htmlFor='ai-switch'
                >
                  3. Use AI to generate taboo words for each target word?
                </FormLabel>
                <FormLabel htmlFor='ai-switch'>
                  If turned on, you are not required to create taboo words for
                  each target word that you created. After submission, if your
                  submission passes the review, we will use AI to create the
                  taboo words for you.
                </FormLabel>
                <Switch
                  id='ai-switch'
                  isChecked={shouldUseAIForTabooWords}
                  size='lg'
                  colorScheme='green'
                  onChange={() => {
                    setShouldUseAIForTabooWords((b) => !b);
                  }}
                />
              </FormControl>
              <FormControl isInvalid={targetWordsErrorMessage.length > 0}>
                <FormLabel
                  mb={0}
                  className={`text-bold text-lg ${
                    targetWordsErrorMessage.length > 0
                      ? 'text-yellow'
                      : 'text-neon-green'
                  }`}
                >
                  4. Give at least 3 target words relevant to the topic provided
                </FormLabel>
                <FormErrorMessage mt={0}>
                  {targetWordsErrorMessage}
                </FormErrorMessage>
                <div className='flex flex-row flex-wrap gap-4 justify-start items-center w-full my-4'>
                  {targetWords.map((w, i) => (
                    <div key={i} className='w-full lg:w-52 relative'>
                      <InputGroup size='md'>
                        <Input
                          autoFocus
                          isDisabled={tabooWordsCheckingStatus[i]}
                          id={`target-${i}`}
                          className={`w-full ${
                            targetWordsErrorMessage.length > 0
                              ? '!border-white'
                              : '!border-neon-green'
                          }`}
                          value={w}
                          placeholder='target word...'
                          pr='40px'
                          onChange={(e) => {
                            changeTargetWordAtIndex(e.target.value, i);
                          }}
                        />
                        <InputRightElement
                          width='60px'
                          height='40px'
                          hidden={w.length == 0}
                        >
                          <IconButton
                            isDisabled={tabooWordsCheckingStatus[i]}
                            data-style='none'
                            variant='unstyled'
                            className='text-white hover:opacity-70 flex justify-center items-center'
                            aria-label='clear text field'
                            size='sm'
                            onClick={() => {
                              clearTargetWordInputAtIndex(i);
                            }}
                            icon={<FiX />}
                          />
                        </InputRightElement>
                      </InputGroup>
                      <IconButton
                        isDisabled={tabooWordsCheckingStatus[i]}
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
              {!shouldUseAIForTabooWords && (
                <FormControl
                  hidden={
                    targetWords.length <= 0 ||
                    targetWords.every((v) => v.length <= 0)
                  }
                >
                  <FormLabel
                    className={`text-bold text-lg ${
                      tabooWordsErrorMessages.filter((m) => m.length > 0)
                        .length > 0
                        ? 'text-yellow'
                        : 'text-neon-green'
                    }`}
                  >
                    5. For each target word, define at least 5 taboo words
                  </FormLabel>
                  <Accordion
                    allowToggle
                    index={controlledAccordianExpandedIndex}
                    onChange={(expandedIndex) => {
                      setControlledAccordianExpandedIndex(
                        expandedIndex as number
                      );
                      if (expandedIndex < 0) {
                        setTabooWordsCheckingStatus(
                          Array(targetWords.length).fill(false)
                        );
                      } else if (
                        tabooWordsExistedStatus[expandedIndex as number] ===
                          null ||
                        (tabooWordsExistedStatus[expandedIndex as number] ===
                          true &&
                          tabooWords[expandedIndex as number].length === 0)
                      ) {
                        checkIfTabooWordsExistedForTarget(
                          expandedIndex as number
                        );
                      }
                    }}
                  >
                    {targetWords.map((w, i) =>
                      w.length > 0 ? (
                        <AccordionItem
                          key={i}
                          isDisabled={tabooWordsCheckingStatus.some(
                            (s) => s === true
                          )}
                        >
                          <h2>
                            <AccordionButton data-style='none'>
                              <Box
                                as='span'
                                flex='1'
                                textAlign='left'
                                className='overflow-clip'
                              >
                                Target Word:{' '}
                                <b
                                  className={`${
                                    tabooWordsErrorMessages[i].length > 0
                                      ? 'text-yellow'
                                      : 'text-neon-green'
                                  }`}
                                >
                                  {w}
                                </b>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel key={i} pb={4} pt={0}>
                            {tabooWordsCheckingStatus[i] ? (
                              <SkeletonText
                                noOfLines={2}
                                className='w-full'
                                boxShadow='lg'
                                spacing={2}
                                skeletonHeight={2}
                              />
                            ) : (
                              <FormControl
                                mt={0}
                                isInvalid={
                                  tabooWordsErrorMessages[i].length > 0
                                }
                                className='w-full'
                              >
                                <FormErrorMessage mt={0} mb={0}>
                                  {tabooWordsErrorMessages[i]}
                                </FormErrorMessage>
                                {tabooWordsExistedStatus[i] && (
                                  <FormLabel className='text-gray'>
                                    Taboo words for &quot;{w}&quot; have already
                                    been defined in our system by others. In
                                    order to respect the contents created by
                                    other players, we are sorry to tell you that
                                    you will not be able to edit the taboo words
                                    here. However, you can still appeal if you
                                    insist on changing. Appeal will be reviewed
                                    in case-by-case basis.{' '}
                                    <span>
                                      <Popover strategy='fixed'>
                                        <PopoverTrigger>
                                          <button
                                            data-style='none'
                                            className='hover:opacity-50 transition-opacity ease-in mx-1 mt-1'
                                          >
                                            <BsInfoSquareFill />
                                          </button>
                                        </PopoverTrigger>
                                        <PopoverContent className='text-black'>
                                          <PopoverArrow />
                                          <PopoverCloseButton
                                            data-style='none'
                                            className='hover:opacity-50 transition-opacity ease-in'
                                          />
                                          <PopoverHeader>
                                            How to appeal?
                                          </PopoverHeader>
                                          <PopoverBody className='leading-5'>
                                            <Button
                                              data-style='none'
                                              variant='outline'
                                              colorScheme='red'
                                              onClick={() => {
                                                openAppeal(w);
                                              }}
                                            >
                                              Click to submit your appeal
                                            </Button>
                                          </PopoverBody>
                                        </PopoverContent>
                                      </Popover>
                                    </span>
                                  </FormLabel>
                                )}
                                <div className='flex flex-row flex-wrap gap-4 justify-start items-center w-full my-4'>
                                  {tabooWords[i].map((tw, ti) => (
                                    <div
                                      key={ti}
                                      className='w-full lg:w-52 relative'
                                    >
                                      <InputGroup size='md'>
                                        <Input
                                          autoFocus
                                          isDisabled={
                                            tabooWordsExistedStatus[i] ?? false
                                          }
                                          id={`taboo-${i}-${ti}`}
                                          key={`taboo-${i}-${ti}`}
                                          className={`w-full ${
                                            tabooWordsErrorMessages[i].length >
                                            0
                                              ? '!border-white'
                                              : '!border-neon-green'
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
                                        />
                                        <InputRightElement
                                          width='60px'
                                          height='40px'
                                          hidden={
                                            w.length == 0 ||
                                            (tabooWordsExistedStatus[i] ??
                                              false)
                                          }
                                        >
                                          <IconButton
                                            hidden={
                                              tabooWords[i][ti].length <= 0
                                            }
                                            data-style='none'
                                            variant='unstyled'
                                            className='text-white hover:opacity-70 flex justify-center items-center'
                                            aria-label='clear text field'
                                            size='sm'
                                            onClick={() => {
                                              clearTabooWordInputAtIndex(i, ti);
                                            }}
                                            icon={<FiX />}
                                          />
                                        </InputRightElement>
                                      </InputGroup>

                                      <IconButton
                                        hidden={
                                          tabooWordsExistedStatus[i] ?? false
                                        }
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
                                </div>

                                <IconButton
                                  hidden={tabooWordsExistedStatus[i] ?? false}
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
                              </FormControl>
                            )}
                          </AccordionPanel>
                        </AccordionItem>
                      ) : (
                        <></>
                      )
                    )}
                  </Accordion>
                </FormControl>
              )}
            </Stack>
          </CardBody>
        </Card>
        <Fade hidden={!isAllValid()} className='mb-4' in={isAllValid()}>
          <Button
            data-style='none'
            variant='solid'
            className=' bg-neon-green text-black hover:text-neon-green hover:bg-black focus:bg-black-darker drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]'
            fontSize={26}
            aria-label='click to review the topic'
            onClick={onOpen}
          >
            Review Your Topic
          </Button>
        </Fade>
      </div>
      <Drawer placement='bottom' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent className='leading-4 text-white bg-black-darker'>
          <DrawerCloseButton data-style='none' className='hover:opacity-70' />
          <DrawerHeader borderBottomWidth='1px'>
            Review Your Topic: <b>{topicName}</b>
          </DrawerHeader>
          <DrawerBody className='w-full flex flex-col items-stretch'>
            <SimpleGrid minChildWidth='240px' spacing={10} my={10} mx={6}>
              {targetWords.map((w, i) => (
                <Card key={i} className='bg-black text-white'>
                  <CardHeader className='text-center text-2xl font-bold'>
                    <h2>{w}</h2>
                  </CardHeader>
                  <CardBody>
                    {shouldUseAIForTabooWords ? (
                      <p>
                        You chose to use AI to generate the taboo words. Your
                        taboo words will be ready once the submission passes the
                        review.
                      </p>
                    ) : (
                      <>
                        <p className='text-red-light'>Taboo Words:</p>
                        <Flex gap={4} flexWrap='wrap' mt={4}>
                          {tabooWords[i]
                            .filter((w) => w.length > 0)
                            .map((tw, ti) => (
                              <Tag
                                variant='solid'
                                key={ti}
                                size='lg'
                                colorScheme='green'
                              >
                                {tw}
                              </Tag>
                            ))}
                        </Flex>
                      </>
                    )}
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
            <FormControl mb={4}>
              <FormLabel>Enter your creator nickname:</FormLabel>
              <Input
                value={nickname}
                placeholder='Creator nickname...'
                onChange={(e) => {
                  setNickname(e.target.value);
                }}
              />
            </FormControl>
            <FormControl mb={4} isInvalid={emailErrorMessage.length > 0}>
              <FormLabel>
                We will notify you about the review result via email:
              </FormLabel>
              <Input
                type='email'
                value={emailAddress}
                placeholder='Your email address...'
                onChange={onEmailChange}
              />
              <FormErrorMessage>{emailErrorMessage}</FormErrorMessage>
            </FormControl>
            <Button
              isDisabled={
                nickname.length <= 0 ||
                emailAddress.length <= 0 ||
                emailErrorMessage.length > 0
              }
              data-style='none'
              variant='solid'
              className={`${
                nickname.length <= 0 ||
                emailAddress.length <= 0 ||
                emailErrorMessage.length > 0
                  ? 'bg-yellow'
                  : 'bg-neon-green'
              } text-black hover:text-gray hover:bg-black focus:bg-black-darker drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]`}
              fontSize={32}
              aria-label='click to submit the topic created'
              mb={4}
              isLoading={isCreatingLevel}
              onClick={submitNewTopic}
            >
              Submit Topic
            </Button>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Modal
        isOpen={isAppealModalOpen}
        onClose={() => {
          setIsAppealModalOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent
          data-style='none'
          className='leading-4 bg-black text-white'
        >
          <ModalHeader className='text-yellow'>
            Submit Appeal For &quot;{selectedWordForAppeal}&quot;
          </ModalHeader>
          <ModalCloseButton data-style='none' />
          <ModalBody>
            <FormControl isInvalid={appealEmailErrorMessage.length > 0}>
              <FormLabel>
                Please provide us with your email address and reasons for the
                appeal, so that we can contact you once we finish the review.
                Thank you for your understanding!
              </FormLabel>
              <Input
                mt={4}
                type='email'
                value={appealEmail}
                placeholder='Email address...'
                onChange={onAppealEmailChange}
              />
              <FormErrorMessage>{appealEmailErrorMessage}</FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={appealReasonErrorMessage.length > 0}>
              <Textarea
                value={appealReasons}
                placeholder='Appeal reasons.'
                onChange={onAppealReasonChange}
              />
              <FormErrorMessage>{appealReasonErrorMessage}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isSubmittingAppeal}
              isDisabled={
                appealReasonErrorMessage.length > 0 ||
                appealEmailErrorMessage.length > 0
              }
              data-style='none'
              colorScheme='green'
              variant='outline'
              mr={3}
              onClick={() => {
                submitAppeal(selectedWordForAppeal);
              }}
            >
              Submit Appeal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddLevelPage;
