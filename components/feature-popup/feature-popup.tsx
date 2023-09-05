'use client';

import ReactMarkdown from 'react-markdown';
import content from '@/public/features/content.md';
import style from './style.module.css';
import { KeyboardEvent, useEffect, useState } from 'react';
import { getFeaturePopupString, setFeaturePopupString } from '@/lib/cache';
import SocialLinkButton from '@/components/custom/social-link-button';
import semver from 'semver';
import { X } from 'lucide-react';
import { BsDiscord } from 'react-icons/bs';

interface FeaturePopupProps {}

export default function FeaturePopup(props: FeaturePopupProps) {
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const incomingVersion = process.env.NEXT_PUBLIC_TABOO_AI_VERSION;

  useEffect(() => {
    const featurePopupString = getFeaturePopupString();
    if (!featurePopupString) {
      displayFeaturePopup();
      return;
    }
    if (incomingVersion) {
      try {
        const versionDiff = semver.diff(
          String(incomingVersion),
          String(featurePopupString)
        );
        if (versionDiff === null || versionDiff === 'patch') {
          // If it is a patch release, or no difference, then we do not show,
          // We only update the version in the local storage
          setShowFeaturePopup(false);
          semver.gt(incomingVersion, featurePopupString) &&
            setFeaturePopupString(incomingVersion);
          return;
        }
        const isIncomingVersionNewer = semver.gt(
          incomingVersion,
          featurePopupString
        );
        if (isIncomingVersionNewer) {
          displayFeaturePopup();
          return;
        }
      } catch {
        displayFeaturePopup();
        return;
      }
    }
    setShowFeaturePopup(false);
  }, []);

  const displayFeaturePopup = () => {
    setShowFeaturePopup(true);
    localStorage.removeItem('pwa-user-choice');
  };

  const close = () => {
    setIsClosed(true);
    setFeaturePopupString(process.env.NEXT_PUBLIC_TABOO_AI_VERSION);
  };

  const escClose = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      setIsClosed(true);
      setFeaturePopupString(process.env.NEXT_PUBLIC_TABOO_AI_VERSION);
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
            className='absolute aspect-square p-2 top-10 right-12 lg:top-12 lg:right-16 text-black z-10 text-3xl rounded-full'
            onClick={close}
          >
            <X />
          </button>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className='relative w-full h-full bg-white rounded-2xl p-4 text-black shadow-2xl flex flex-col gap-4 overflow-y-scroll'
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
                  icon={<BsDiscord />}
                  href='https://discord.gg/dgqs29CHC2'
                  newTab={true}
                  className='flex-grow'
                />
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
