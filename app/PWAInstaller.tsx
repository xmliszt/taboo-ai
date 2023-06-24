'use client';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';

export default function PWAInstaller({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawOpen, setIsDrawOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('openPWADrawer', () => {
      setIsDrawOpen(true);
    });
    window.addEventListener('closePWADrawer', () => {
      setIsDrawOpen(false);
    });
  }, []);

  const onInstall = async () => {
    if (window.deferredprompt) {
      window.deferredprompt.prompt();
      const { outcome } = await window.deferredprompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-user-choice', 'accepted');
        dispatchEvent(new CustomEvent('hideInstallButton'));
      } else {
        localStorage.setItem('pwa-user-choice', 'cancelled');
      }
    }
    setIsDrawOpen(false);
  };

  const onCancel = () => {
    localStorage.setItem('pwa-user-choice', 'cancelled');
    setIsDrawOpen(false);
  };

  const onDrawerClose = () => {
    setIsDrawOpen(false);
  };

  return (
    <>
      {children}
      <Drawer
        placement='bottom'
        size='md'
        onClose={onDrawerClose}
        isOpen={isDrawOpen}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <DrawerOverlay className='backdrop-blur-sm' />
        <DrawerContent className='h-auto rounded-t-2xl py-4'>
          <DrawerHeader className='text-black flex flex-row gap-2 items-center'>
            <FiDownload />
            You Can Install Taboo AI as App!
          </DrawerHeader>
          <DrawerBody className='flex flex-col gap-2'>
            <p className='text-xl text-black'>
              Taboo AI can be easily installed as an application on your device,
              allowing you to seamlessly incorporate it into your routine just
              like any other app, without the need to open a separate browser.
            </p>
            <div
              id='button-group'
              className='flex flex-row justify-around gap-4'
            >
              <Button
                className='w-1/2 !bg-yellow !text-black'
                onClick={onInstall}
              >
                Install
              </Button>
              <Button className='w-1/2 !bg-gray !text-white' onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
