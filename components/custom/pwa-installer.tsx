'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function PWAInstaller() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('openPWADrawer', () => {
      setIsOpen(true);
    });
    window.addEventListener('closePWADrawer', () => {
      setIsOpen(false);
    });
  }, []);

  const onInstall = async () => {
    if (window.deferredprompt) {
      window.deferredprompt.prompt();
      const { outcome } = await window.deferredprompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-user-choice', 'accepted');
      } else {
        localStorage.setItem('pwa-user-choice', 'cancelled');
      }
    }
    setIsOpen(false);
  };

  const onCancel = () => {
    localStorage.setItem('pwa-user-choice', 'cancelled');
    setIsOpen(false);
  };

  return isOpen ? (
    <div className='fixed bottom-4 left-4 w-72 max-w-[95%] rounded-lg border bg-popover p-4 shadow-lg animate-in'>
      <button className='group absolute right-2 top-2 text-muted-foreground' onClick={onCancel}>
        <X
          size={16}
          className='transition-transform duration-300 ease-out group-hover:rotate-[180deg]'
        />
      </button>
      <h3 className='mb-2 flex flex-row items-center gap-1 text-base font-bold'>
        Taboo AI can be installed!
      </h3>
      <div className='flex flex-col gap-2'>
        <p className='mb-2 text-sm leading-snug'>
          Taboo AI can be easily installed just like any other app. Give it a try?
        </p>
        <div id='button-group' className='flex flex-row justify-around gap-4'>
          <Button onClick={onInstall} className='group flex items-center gap-2' size={'sm'}>
            <Download size={16} className='transition-transform ease-out group-hover:scale-110' />
            Install
          </Button>
        </div>
      </div>
    </div>
  ) : null;
}
