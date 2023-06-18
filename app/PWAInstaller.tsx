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
import { changePWAUserChoice, getPWAUserChoice } from '../lib/cache';

export default function PWAInstaller({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDrawOpen, setIsDrawOpen] = useState(false);
  const [promptEvent, setPromptEvent] = useState<
    BeforeInstallPromptEvent | undefined
  >();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      const userChoice = getPWAUserChoice();
      userChoice !== 'accepted' &&
        userChoice !== 'cancelled' &&
        setIsDrawOpen(true);
      const _promptEvent = e as BeforeInstallPromptEvent;
      setPromptEvent(_promptEvent);
      _promptEvent === undefined
        ? dispatchEvent(new CustomEvent('hideInstallButton'))
        : dispatchEvent(new CustomEvent('showInstallButton'));
    });
    window.addEventListener('appinstalled', () => {
      setIsDrawOpen(false);
      setPromptEvent(undefined);
      changePWAUserChoice('accepted');
      dispatchEvent(new CustomEvent('hideInstallButton'));
      console.log('PWA INSTALLED');
    });
    window.addEventListener('InitPWAInstallation', () => {
      changePWAUserChoice('cancelled');
      setIsDrawOpen(true);
    });
  }, []);

  const onInstall = async () => {
    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        changePWAUserChoice('accepted');
      } else {
        changePWAUserChoice('cancelled');
      }
    }
    setIsDrawOpen(false);
  };

  const onCancel = () => {
    changePWAUserChoice('cancelled');
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
