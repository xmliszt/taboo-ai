import { Switch } from '@/components/ui/switch';

import { InfoButton } from '../../info-button';

interface ProfilePrivacyFeatureToggleProps {
  title: string;
  description: string;
  checked?: boolean;
  onToggle: (checked: boolean) => void;
}

export default function ProfilePrivacyFeatureToggle({
  title,
  description,
  checked,
  onToggle,
}: ProfilePrivacyFeatureToggleProps) {
  return (
    <div className='flex flex-row items-center justify-between'>
      <div className='flex flex-row items-center'>
        {title}
        <InfoButton description={description} tooltip='More info' />
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(checked) => {
          onToggle(checked);
        }}
      />
    </div>
  );
}
