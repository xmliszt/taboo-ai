'use client';

import { Tag } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function InstallButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener('showInstallButton', () => {
      setShowButton(true);
    });
    window.addEventListener('hideInstallButton', () => {
      setShowButton(false);
    });
  }, []);

  const onInstallClick = () => {
    dispatchEvent(new CustomEvent('InitPWAInstallation'));
  };

  return showButton ? (
    <Tag
      className='cursor-pointer hover:scale-105 transition-transform bg-gray text-black'
      onClick={onInstallClick}
    >
      INSTALL APP
    </Tag>
  ) : (
    <></>
  );
}
