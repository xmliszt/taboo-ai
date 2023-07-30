'use client';

import Image from 'next/image';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';
import useToast from '../lib/hook/useToast';
import { sendEmail } from '../lib/services/frontend/emailService';
import ProductHuntBadge from './../public/images/producthunt.svg';
import { emailIsValid } from '../lib/utilities';

const MAX_CHAR_LIMIT = 50;

const ContactMe = () => {
  const { toast } = useToast();
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderMessage, setSenderMessage] = useState('');
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [isMessageError, setIsMessageError] = useState(false);
  const [isNicknameError, setIsNicknameError] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const validateEmail = (email: string): boolean => {
    let isEmailError = false;
    if (email.length <= 0) {
      isEmailError = true;
      setEmailErrorMessage('Email is required');
    } else if (!emailIsValid(email)) {
      isEmailError = true;
      setEmailErrorMessage('Invalid email address');
    } else {
      isEmailError = false;
    }
    setIsEmailError(isEmailError);
    return isEmailError;
  };

  const validateMessage = (message: string): boolean => {
    const isMessageError = message.length <= 0;
    setIsMessageError(isMessageError);
    return isMessageError;
  };

  const validateNickname = (nickname: string): boolean => {
    const isNicknameError = nickname.length <= 0;
    setIsNicknameError(isNicknameError);
    return isNicknameError;
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSenderEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const onMessageChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSenderMessage(e.target.value);
    validateMessage(e.target.value);
  };

  const onNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_CHAR_LIMIT) return;
    setSenderName(e.target.value);
    validateNickname(e.target.value);
  };

  const onClickSend = async () => {
    if (
      !validateNickname(senderName) &&
      !validateEmail(senderEmail) &&
      !validateMessage(senderMessage)
    ) {
      try {
        setIsSendingEmail(true);
        await sendEmail(senderName, senderEmail, senderMessage);
        toast({ title: 'Email is sent successfully!', status: 'success' });
        setSenderEmail('');
        setSenderMessage('');
      } catch (error) {
        toast({ title: error.message, status: 'error' });
      } finally {
        setIsSendingEmail(false);
      }
    }
  };

  return (
    <section>
      <Card
        dropShadow='2xl'
        boxShadow='2xl'
        backgroundColor='blackAlpha.500'
        textColor='whiteAlpha.800'
      >
        <CardHeader>
          <h1>Contact Me</h1>
        </CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Stack gap={4}>
              <FormControl isRequired isInvalid={isNicknameError}>
                <FormLabel>How do we address you?</FormLabel>
                <Input
                  type='text'
                  value={senderName}
                  placeholder='Your name / nickname...'
                  focusBorderColor='whiteAlpha.800'
                  onChange={onNicknameChange}
                />
                <FormErrorMessage>Your name is required</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={isEmailError}>
                <FormLabel>Email Address</FormLabel>
                <Input
                  type='email'
                  value={senderEmail}
                  placeholder='Your email address'
                  focusBorderColor='whiteAlpha.800'
                  onChange={onEmailChange}
                />
                <FormErrorMessage>{emailErrorMessage}</FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={isMessageError}>
                <FormLabel>Message</FormLabel>
                <Textarea
                  value={senderMessage}
                  focusBorderColor='whiteAlpha.800'
                  onChange={onMessageChange}
                />
                <FormErrorMessage>Message is required</FormErrorMessage>
              </FormControl>
              <Center>
                <Button
                  isDisabled={isEmailError || isMessageError || isNicknameError}
                  className='h-10 max-w-[400px] w-full'
                  isLoading={isSendingEmail}
                  onClick={onClickSend}
                >
                  Send
                </Button>
              </Center>
            </Stack>

            <Stack direction='row' gap={4}>
              <a
                className='hover: opacity-70 hover:scale-105 hover:drop-shadow-2xl hover:mix-blend-plus-lighter transition-all'
                href='https://theresanaiforthat.com/ai/taboo-ai/?ref=embed'
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  className='drop-shadow-xl bg-blend-overlay'
                  alt="TabooAI is featured on THERE'S AN AI FOR THAT"
                  width='240'
                  height='65'
                  src='https://media.theresanaiforthat.com/featured4.png'
                />
              </a>
              <a
                className='hover: opacity-70 hover:scale-105 hover:drop-shadow-2xl hover:mix-blend-plus-lighter transition-all'
                href='https://www.producthunt.com/products/taboo-ai?utm_source=badge-follow&utm_medium=badge&utm_souce=badge-taboo&#0045;ai'
                target='_blank'
                rel='noreferrer'
              >
                <Image
                  className='drop-shadow-xl bg-blend-overlay'
                  alt='Taboo&#0046;AI - Taboo&#0046;AI&#0032;&#0045;&#0032;The&#0032;Ultimate&#0032;Wordplay&#0032;Challenge&#0032;against&#0032;AI | Product Hunt'
                  width='240'
                  height='50'
                  src={ProductHuntBadge}
                />
              </a>
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </section>
  );
};

export default ContactMe;
