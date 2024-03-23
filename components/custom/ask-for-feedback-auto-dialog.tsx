'use client';

import { useEffect, useState, useTransition } from 'react';
import { validate } from 'email-validator';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { fetchUserProfile, UserProfile } from '@/app/profile/server/fetch-user-profile';
import { sendEmail } from '@/lib/services/send-email';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';

const DELAY_BEFORE_ASKING_FOR_FEEDBACK = 1000 * 60 * 1; // 1 minute
const TOTAL_NUMBER_OF_TIMES_TO_ASK_FOR_FEEDBACK = 3;
let feedbackCount = 0;

export function AskForFeedbackAutoDialog() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>();
  const [customEmail, setCustomEmail] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');

  useEffect(() => {
    startTransition(async () => {
      try {
        const user = await fetchUserProfile();
        setUser(user);
      } catch (error) {
        console.log('user not logged in');
      }
    });
  }, []);

  useEffect(() => {
    if (feedbackCount >= TOTAL_NUMBER_OF_TIMES_TO_ASK_FOR_FEEDBACK) return;
    setTimeout(() => {
      setIsOpen(true);
    }, DELAY_BEFORE_ASKING_FOR_FEEDBACK);
  }, []);

  function sendFeedback() {
    if (!feedbackContent) return;
    if (!user && !customEmail) return;
    const name = user?.nickname ?? user?.name ?? 'Unknown';
    startTransition(async () => {
      try {
        await sendEmail(
          name,
          user?.email ?? customEmail,
          feedbackContent,
          `Feedback from ${name} (${user?.email ?? customEmail})`,
          `
        <h2>From: ${user?.email ?? customEmail}</h2>
        <p>${feedbackContent}</p>
      `
        );
        toast.success("Thank you for your feedback! We'll get back to you soon :)");
      } catch (error) {
        console.error(error);
        toast.error("We couldn't send your feedback at the moment. Please try again later.");
      } finally {
        setIsOpen(false);
        feedbackCount++;
      }
    });
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          feedbackCount++;
        }
      }}
    >
      <PopoverTrigger asChild>
        {/* Anchor element for the popover */}
        <div className='pointer-events-none invisible fixed bottom-4 right-4' />
      </PopoverTrigger>
      <PopoverContent className='relative' side={'top'} align={'end'} alignOffset={16}>
        <button
          className='group absolute right-2 top-2 text-muted-foreground'
          onClick={() => {
            setIsOpen(false);
            feedbackCount++;
          }}
        >
          <X
            size={16}
            className='transition-transform duration-300 ease-out group-hover:rotate-[180deg]'
          />
        </button>
        <div className='flex flex-col gap-2'>
          <h3 className='text-base font-bold'>{`How are you enjoying Taboo AI?`}</h3>
          <p className='text-sm font-light text-muted-foreground'>
            {`We would love to hear your feedback on how we can improve our product. :)`}
          </p>
          <form action='' className='flex flex-col items-end gap-2'>
            <Input
              disabled={user?.email !== undefined}
              id='email-input'
              type='email'
              placeholder='Enter your email address'
              value={user?.email ?? customEmail}
              onChange={(e) => {
                setCustomEmail(e.target.value);
              }}
            />
            <Textarea
              autoFocus
              id='feedback-input'
              placeholder='Enter your feedback'
              rows={5}
              value={feedbackContent}
              className='resize-none'
              onChange={(e) => {
                setFeedbackContent(e.target.value);
              }}
            />
            <Button
              className='w-fit'
              disabled={
                !feedbackContent ||
                isPending ||
                (!user && !customEmail) ||
                (!user && !validate(customEmail))
              }
              onClick={() => {
                sendFeedback();
              }}
            >
              Submit
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
