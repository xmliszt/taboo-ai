'use client';

import ReactMarkdown from 'react-markdown';
import content from '../../../public/features/content.md';
import style from './style.module.css';
import { KeyboardEvent, useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import {
  getFeaturePopupString,
  setFeaturePopupString,
} from '../../../lib/cache';
import SocialLinkButton from '../SocialLinkButton';
import { SiDiscord } from 'react-icons/si';
import { CONSTANTS } from '../../../lib/constants';

interface FeaturePopupProps {}

export default function FeaturePopup(props: FeaturePopupProps) {
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);

  useEffect(() => {
    const featurePopupString = getFeaturePopupString();
    if (!featurePopupString) {
      setShowFeaturePopup(true);
    } else if (featurePopupString !== CONSTANTS.featurePopupString) {
      setShowFeaturePopup(true);
    } else {
      setShowFeaturePopup(false);
    }
  }, []);

  const close = () => {
    setIsClosed(true);
    setFeaturePopupString(CONSTANTS.featurePopupString);
  };

  const escClose = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsClosed(true);
      setFeaturePopupString(CONSTANTS.featurePopupString);
    }
  };
  return (
    <div hidden={!showFeaturePopup}>
      {!isClosed && (
        <div
          onClick={close}
          onKeyDown={escClose}
          className='w-full h-full fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(255,255,255,0.5)] backdrop-blur-sm z-[999] leading-normal animate-fade-in p-8'
        >
          <button
            data-style='none'
            className='absolute aspect-square p-2 top-10 right-12 lg:top-12 lg:right-16 text-black z-10 text-3xl rounded-full bg-white dark:text-neon-white dark:bg-neon-black'
            onClick={close}
          >
            <MdOutlineClose />
          </button>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className='relative w-full h-full bg-white rounded-2xl p-4 text-black drop-shadow-2xl flex flex-col gap-4 dark:bg-neon-black dark:text-neon-white overflow-y-scroll'
          >
            <article
              data-testid='content-article'
              className='leading-snug h-full'
            >
              <ReactMarkdown className={`${style.markdown} pb-16`}>
                {content}
              </ReactMarkdown>
              <div className='sticky bottom-0 w-full flex px-2'>
                <SocialLinkButton
                  content='Join our Discord for more updates!'
                  icon={<SiDiscord />}
                  href='https://discord.gg/dgqs29CHC2'
                  newTab={true}
                  customClass='flex-grow'
                  accentColorClass='bg-purple dark:bg-neon-purple'
                  dropShadowClass='hover:drop-shadow-[0_5px_15px_rgba(224,158,255,0.6)]'
                />
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
