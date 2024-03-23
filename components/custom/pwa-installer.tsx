'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

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

  const onSheetOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <Popover onOpenChange={onSheetOpenChange} open={isOpen}>
      <PopoverTrigger asChild>
        <div className='fixed bottom-4 left-4' />
      </PopoverTrigger>
      <PopoverContent side={'top'} align={'start'} alignOffset={16}>
        <button
          autoFocus={false}
          className='group absolute right-2 top-2 text-muted-foreground'
          onClick={onCancel}
        >
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
      </PopoverContent>
    </Popover>
  );
}
