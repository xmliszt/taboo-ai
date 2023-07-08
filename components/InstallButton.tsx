'use client';

import { Tag } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const prompt = window.deferredprompt;
    setShowButton(prompt !== undefined && prompt !== null);
    window.addEventListener('showInstallButton', () => {
      setShowButton(true);
    });
  }, []);

  const onInstallClick = () => {
    dispatchEvent(new CustomEvent('InitPWAInstallation'));
  };

  return showButton ? (
    <Tag
      className='cursor-pointer hover:scale-105 transition-transform bg-gray text-black mt-5'
      onClick={onInstallClick}
    >
      INSTALL APP
    </Tag>
  ) : (
    <></>
  );
}
