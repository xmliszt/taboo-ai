'use client';

import { useEffect, useState } from 'react';
import { Button } from '../ui/button';

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
    <Button className='shadow-xl' onClick={onInstallClick}>
      Install App Now
    </Button>
  ) : (
    <></>
  );
}
