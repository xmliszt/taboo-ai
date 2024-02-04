'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { validate } from 'email-validator';
import { toast } from 'sonner';

import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { sendEmail } from '@/lib/services/send-email';

type GenericFeedbackDialogProps = {
  title: string;
  user?: UserProfile;
  description?: string;
  defaultFeedback?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
};

/**
 * Alert dialog that triggers globally for user to submit feedback.
 * User email is required.
 */
export default function GenericFeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('Feedback');
  const [user, setUser] = useState<UserProfile>();
  const [customEmail, setCustomEmail] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [description, setDescription] = useState<string>();
  const [submitLabel, setSubmitLabel] = useState<string>('Submit');
  const [cancelLabel, setCancelLabel] = useState<string>('Cancel');
  const onSubmit = useRef<() => void>();
  const onCancel = useRef<() => void>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const listener = EventManager.bindEvent<GenericFeedbackDialogProps>(
      CustomEventKey.GENERIC_FEEDBACK_DIALOG,
      ({ detail }) => {
        setIsOpen(true);
        setTitle(detail.title);
        setDescription(detail.description);
        setUser(detail.user);
        setSubmitLabel(detail.submitLabel ?? 'Submit');
        setCancelLabel(detail.cancelLabel ?? 'Cancel');
        setFeedbackContent(detail.defaultFeedback ?? '');
        onSubmit.current = detail.onSubmit;
        onCancel.current = detail.onCancel;
      }
    );
    return () => {
      EventManager.removeListener(CustomEventKey.GENERIC_FEEDBACK_DIALOG, listener);
    };
  }, []);

  const sendFeedback = () => {
    if (!feedbackContent) return;
    if (!user && !customEmail) return;
    const name = user?.nickname ?? user?.name ?? 'Unknown';
    startTransition(async () => {
      try {
        await sendEmail(
          name,
          user?.email ?? customEmail,
          feedbackContent,
          `Feedback - ${title} - from ${name} (${user?.email ?? customEmail})`,
          `
        <h1>${title}</h1>
        <p>${description}</p>
        <h2>From: ${user?.email ?? customEmail}</h2>
        <p>${feedbackContent}</p>
      `
        );
        toast.success('Your feedback has been sent. Thank you!');
      } catch (error) {
        console.error(error);
        toast.error("We couldn't send your feedback at the moment. Please try again later.");
      }
    });
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <form action=''>
          <div className='flex flex-row items-center gap-2'>
            <Label htmlFor='email-input' className='w-[60px]'>
              Email
            </Label>
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
          </div>
          <div className='h-2'></div>
          <div className='flex flex-row items-center gap-2'>
            <Label htmlFor='feedback-input' className='w-[60px]'>
              Details
            </Label>
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
          </div>
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel.current?.();
            }}
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={
              !feedbackContent ||
              isPending ||
              (!user && !customEmail) ||
              (!user && !validate(customEmail))
            }
            onClick={() => {
              sendFeedback();
              onSubmit.current?.();
              setIsOpen(false);
            }}
          >
            {submitLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function feedback(options: GenericFeedbackDialogProps) {
  EventManager.fireEvent<GenericFeedbackDialogProps>(
    CustomEventKey.GENERIC_FEEDBACK_DIALOG,
    options
  );
}
