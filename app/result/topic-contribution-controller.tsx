'use client';

import React, { useState } from 'react';

import { Level } from '@/app/level/[id]/server/fetch-level';
import { SignInReminderProps } from '@/components/custom/globals/sign-in-reminder-dialog';
import { TopicReviewSheet } from '@/components/custom/topic-review-sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

type TopicContributionControllerProps = {
  level: Level;
  user?: User;
};

export function TopicContributionController(props: TopicContributionControllerProps) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(true);
  const [isTopicReviewSheetOpen, setIsTopicReviewSheetOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Enjoy the game so far? Would you like to contribute this AI-generated topic to us?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Nope</AlertDialogCancel>
            <AlertDialogAction
              autoFocus
              onClick={() => {
                setIsAlertDialogOpen(false);
                if (!props.user) {
                  EventManager.fireEvent<SignInReminderProps>(CustomEventKey.SIGN_IN_REMINDER, {
                    title: 'Please sign in to contribute topics.',
                    redirectHref: `/add-level`,
                  });
                  return;
                }
                setIsTopicReviewSheetOpen(true);
              }}
            >
              Sure why not
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {props.user && (
        <TopicReviewSheet
          open={isTopicReviewSheetOpen}
          onOpenChange={(open) => {
            setIsTopicReviewSheetOpen(open);
          }}
          user={props.user}
          topicName={props.level.name}
          difficultyLevel={String(props.level.difficulty)}
          shouldUseAIForTabooWords={true}
          targetWords={props.level.words}
          onTopicSubmitted={() => {
            setIsTopicReviewSheetOpen(false);
          }}
          isAIGenerated={props.level.is_ai_generated}
        />
      )}
    </>
  );
}
