'use client';

import { Mail } from 'lucide-react';

import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import { feedback } from '@/components/custom/globals/generic-feedback-dialog';
import IconButton from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

type ProfileFeedbackFloatingButtonProps = {
  user: UserProfile;
};

export function ProfileFeedbackFloatingButton(props: ProfileFeedbackFloatingButtonProps) {
  return (
    <div className='fixed bottom-6 right-6 z-50'>
      <IconButton
        tooltip={'Submit your feedback'}
        variant={'outline'}
        className={cn(
          'flex !h-12 !w-12 items-center justify-center rounded-full !text-muted-foreground shadow-lg',
          'group/feedback transition-transform ease-in-out hover:scale-90'
        )}
        onClick={() => {
          feedback({
            title: 'Feedback',
            description: 'How do you feel about our app? Any suggestions or bugs? Let us know!',
            user: props.user,
          });
        }}
      >
        <Mail
          className={
            'transition-transform ease-in-out group-hover/feedback:rotate-12 group-hover/feedback:scale-110'
          }
        />
      </IconButton>
    </div>
  );
}
