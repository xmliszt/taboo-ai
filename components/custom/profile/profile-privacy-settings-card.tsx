import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { VenetianMask } from 'lucide-react';
import ProfilePrivacyFeatureToggle from './privacy/profile-privacy-feature-toggle';
import { useEffect, useState } from 'react';
import IUser from '@/lib/types/user.type';
import { updateUserAnonymity } from '@/lib/services/userService';

interface ProfilePrivacySettingsCardProps {
  user: IUser;
  className?: string;
}

export default function ProfilePrivacySettingsCard({
  user,
  className,
}: ProfilePrivacySettingsCardProps) {
  const [isAnonymous, setIsAnonymous] = useState(user.anonymity ?? false);

  useEffect(() => {
    updateUserAnonymity(user.email, isAnonymous);
  }, [isAnonymous]);

  return (
    <Card className={cn(className)}>
      <CardContent>
        <CardHeader className='p-0 my-4'>
          <VenetianMask />
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardDescription>Control your privacy settings here.</CardDescription>

        <div className='flex flex-col gap-4 mt-6'>
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
