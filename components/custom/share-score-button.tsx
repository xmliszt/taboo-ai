'use client';

import { Share } from 'lucide-react';

import { CustomEventKey, EventManager } from '@/lib/event-manager';

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
