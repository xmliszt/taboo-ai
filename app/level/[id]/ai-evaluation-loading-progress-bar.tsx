'use client';

import { useEffect, useRef, useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

type AIEvaluationLoadingProgressBarProps = {
  open: boolean;
  current: number;
  total: number;
};

const AI_EVALUATION_LOADING_MESSAGES = [
  'analyzing grammar and syntax...',
  'checking word choice...',
  'evaluating creativity...',
  'generating feedbacks...',
];

export function AiEvaluationLoadingProgressBar(props: AIEvaluationLoadingProgressBarProps) {
  const [currentlyDisplayMessage, setCurrentlyDisplayMessage] = useState<string>('');
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    // Loop the messages
    let index = 0;
    intervalRef.current = window.setInterval(() => {
      setCurrentlyDisplayMessage(AI_EVALUATION_LOADING_MESSAGES[index]);
      index = (index + 1) % AI_EVALUATION_LOADING_MESSAGES.length;
    }, 3000);
  }, []);

  return (
    <AlertDialog open={props.open}>
      <AlertDialogContent>
        <AlertDialogHeader>Game over! Taboo AI is evaluating your performance...</AlertDialogHeader>
        <AlertDialogDescription>
          <div className='flex flex-row items-center justify-between'>
            <span>{currentlyDisplayMessage}</span>
            <span>
              {props.current}/{props.total}
            </span>
          </div>
        </AlertDialogDescription>
        <Progress value={(props.current / props.total) * 100} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
