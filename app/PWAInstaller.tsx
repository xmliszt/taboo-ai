'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PWAInstaller({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <>
      {children}
      <Sheet onOpenChange={onSheetOpenChange} open={isSheetOpen}>
        <SheetContent side='bottom'>
          <SheetHeader className='text-black flex flex-row gap-1 items-center mb-2 font-extrabold text-lg'>
            <Download size={16} />
            You Can Install Taboo AI as App!
          </SheetHeader>
          <div className='flex flex-col gap-2'>
            <p className='leading-snug mb-2'>
              Taboo AI can be easily installed as an application on your device,
              allowing you to seamlessly incorporate it into your routine just
              like any other app, without the need to open a separate browser.
            </p>
            <div
              id='button-group'
              className='flex flex-row justify-around gap-4'
            >
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
    </>
  );
}
