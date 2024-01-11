import { useEffect, useState } from 'react';
import { VenetianMask } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { updateUserAnonymity } from '@/lib/services/userService';
import { IUser } from '@/lib/types/user.type';
import { cn } from '@/lib/utils';

import ProfilePrivacyFeatureToggle from './privacy/profile-privacy-feature-toggle';

interface ProfilePrivacySettingsCardProps {
  user: IUser;
  className?: string;
}

export default function ProfilePrivacySettingsCard({
  user,
  className,
}: ProfilePrivacySettingsCardProps) {
  const [isAnonymous, setIsAnonymous] = useState(user.is_anonymous ?? false);

  useEffect(() => {
    void updateUserAnonymity(user.id, isAnonymous);
  }, [isAnonymous]);

  return (
    <Card className={cn(className)}>
      <CardContent>
        <CardHeader className='my-4 p-0'>
          <VenetianMask />
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardDescription>Control your privacy settings here.</CardDescription>

        <div className='mt-6 flex flex-col gap-4'>
          <ProfilePrivacyFeatureToggle
            title='Stay Anonymous?'
            description='If turned on, your nickname will be hidden from others when shown in the topic rankings. It will be shown as "Anonymous" instead.'
            checked={isAnonymous}
            onToggle={(isOn) => {
              setIsAnonymous(isOn);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
