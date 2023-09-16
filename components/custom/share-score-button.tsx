'use client';

import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { Share } from 'lucide-react';
import IconButton from '../ui/icon-button';

export default function ShareScoreButton() {
  const handleShare = () => {
    EventManager.fireEvent(CustomEventKey.SHARE_SCORE);
  };

  return (
    <IconButton tooltip='Share your scores' onClick={handleShare}>
      <Share />
    </IconButton>
  );
}
