'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';

export default function PWAInstaller() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('openPWADrawer', () => {
      setIsSheetOpen(true);
    });
    window.addEventListener('closePWADrawer', () => {
      setIsSheetOpen(false);
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
    setIsSheetOpen(false);
  };

  const onCancel = () => {
    localStorage.setItem('pwa-user-choice', 'cancelled');
    setIsSheetOpen(false);
  };

  const onSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen);
  };

  return (
    <Sheet onOpenChange={onSheetOpenChange} open={isSheetOpen}>
      <SheetContent side='bottom'>
        <SheetHeader className='mb-2 flex flex-row items-center gap-1 text-lg font-extrabold text-black'>
          <Download size={16} />
          You Can Install Taboo AI as App!
        </SheetHeader>
        <div className='flex flex-col gap-2'>
          <p className='mb-2 leading-snug'>
            Taboo AI can be easily installed as an application on your device, allowing you to
            seamlessly incorporate it into your routine just like any other app, without the need to
            open a separate browser.
          </p>
          <div id='button-group' className='flex flex-row justify-around gap-4'>
            <Button className='w-1/2' onClick={onInstall}>
              Install
            </Button>
            <Button className='w-1/2' onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
