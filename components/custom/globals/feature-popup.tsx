'use client';

import { useEffect, useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import ReactMarkdown from 'react-markdown';
import semver from 'semver';

import SocialLinkButton from '@/components/custom/social-link-button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getFeaturePopupString, setFeaturePopupString } from '@/lib/cache';
import content from '@/public/features/content.md';

export default function FeaturePopup() {
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
        const versionDiff = semver.diff(String(incomingVersion), String(featurePopupString));
        if (versionDiff === null) {
          // If no difference, then we do not show,
          // We only update the version in the local storage
          setShowFeaturePopup(false);
          semver.gt(incomingVersion, featurePopupString) && setFeaturePopupString(incomingVersion);
          return;
        }
        const isIncomingVersionNewer = semver.gt(incomingVersion, featurePopupString);
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

  const handleOpenChange = (isOpen: boolean) => {
    setShowFeaturePopup(isOpen);
    !isOpen && setFeaturePopupString(process.env.NEXT_PUBLIC_TABOO_AI_VERSION);
  };

  return (
    <Dialog defaultOpen={showFeaturePopup} open={showFeaturePopup} onOpenChange={handleOpenChange}>
      <DialogContent className='h-[90%] w-[95%] rounded-lg'>
        <article
          data-testid='content-article'
          className='h-full overflow-y-scroll leading-snug scrollbar-hide'
        >
          <ReactMarkdown className='pb-8'>{content}</ReactMarkdown>
          <div className='sticky bottom-4 flex w-full justify-center px-2'>
            <SocialLinkButton
              content='Join Discord Community'
              icon={<BsDiscord />}
              href='https://discord.gg/dgqs29CHC2'
              newTab={true}
            />
          </div>
        </article>
      </DialogContent>
    </Dialog>
  );
}
