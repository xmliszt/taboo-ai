'use client';

import { useEffect, useState, useTransition } from 'react';
import { validate } from 'email-validator';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import { fetchUserProfile } from '@/app/profile/server/fetch-user-profile';
import { sendEmail } from '@/lib/services/send-email';

import { useAskForFeedbackControl } from '../ask-for-feedback-provider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';

export function AskForFeedbackDialog() {
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<User>();
  const [customEmail, setCustomEmail] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const { isFeedbackOpen, setIsFeedbackOpen } = useAskForFeedbackControl();

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
        setIsFeedbackOpen(false);
      }
    });
  }

  return (
    <Popover open={isFeedbackOpen} onOpenChange={(open) => setIsFeedbackOpen(open)}>
      <PopoverTrigger asChild>
        <div className='fixed bottom-4 right-4 -z-50'></div>
      </PopoverTrigger>
      <PopoverContent
        side={'top'}
        align={'end'}
        autoFocus={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <button
          className='group absolute right-2 top-2 text-muted-foreground'
          onClick={() => setIsFeedbackOpen(false)}
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
            {typeof user?.email !== 'string' && (
              <Input
                id='email-input'
                type='email'
                placeholder='Enter your email address'
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
            )}
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
