'use client';

import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { Menu } from 'lucide-react';
import IconButton from '../ui/icon-button';

export function MenuButton() {
  return (
    <IconButton
      tooltip='Open Menu'
      onClick={() => {
        EventManager.fireEvent<boolean>(CustomEventKey.TOGGLE_MENU, true);
      }}
    >
      <Menu />
    </IconButton>
  );
}
