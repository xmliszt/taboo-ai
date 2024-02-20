'use client';

import { Menu } from 'lucide-react';

import { CustomEventKey, EventManager } from '@/lib/event-manager';

import IconButton from '../ui/icon-button';

export function MenuButton() {
  return (
    <IconButton
      tooltip='Open menu'
      onClick={() => {
        EventManager.fireEvent<boolean>(CustomEventKey.TOGGLE_MENU, true);
      }}
    >
      <Menu />
    </IconButton>
  );
}
