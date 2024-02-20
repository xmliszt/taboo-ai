'use client';

import React, { useState } from 'react';

import { Level } from '@/app/level/[id]/server/fetch-level';
import { UserProfile } from '@/app/profile/server/fetch-user-profile';
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
  user?: UserProfile;
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
                    title: 'You need to sign in to contribute a topic to us.',
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
          defaultNickname={props.user.nickname ?? props.user.name}
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
