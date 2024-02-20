'use client';

import { useState } from 'react';
import { VenetianMask } from 'lucide-react';
import { toast } from 'sonner';

import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import { updateUserAnonymity } from '@/app/profile/server/update-user-anonymity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import ProfilePrivacyFeatureToggle from './profile-privacy-feature-toggle';

interface ProfilePrivacySettingsCardProps {
  user: UserProfile;
  className?: string;
}

export function ProfilePrivacySettingsCard({ user, className }: ProfilePrivacySettingsCardProps) {
  const [isAnonymous, setIsAnonymous] = useState(user.is_anonymous);

  return (
    <Card className={cn(className)}>
      <CardContent>
        <CardHeader className='my-4 p-0'>
          <VenetianMask />
          <CardTitle>Privacy settings</CardTitle>
        </CardHeader>
        <CardDescription>Control your privacy settings here.</CardDescription>

        <div className='mt-6 flex flex-col gap-4'>
          <ProfilePrivacyFeatureToggle
            title='Stay anonymous?'
            description='If turned on, your nickname will be hidden from others when shown in the topic rankings. It will be shown as "Anonymous" instead.'
            onToggle={async (isOn) => {
              try {
                setIsAnonymous(isOn);
                await updateUserAnonymity(user.id, isOn);
                toast.success('Your privacy settings has been updated successfully!');
              } catch (error) {
                setIsAnonymous(!isOn);
                console.error(error);
                toast.error('Failed to update your privacy settings. Please try again later.');
              }
            }}
            checked={isAnonymous}
          />
        </div>
      </CardContent>
    </Card>
  );
}
