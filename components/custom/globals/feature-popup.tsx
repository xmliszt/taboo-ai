'use client';

import ReactMarkdown from 'react-markdown';
import content from '@/public/features/content.md';
import { useEffect, useState } from 'react';
import { getFeaturePopupString, setFeaturePopupString } from '@/lib/cache';
import SocialLinkButton from '@/components/custom/social-link-button';
import semver from 'semver';
import { BsDiscord } from 'react-icons/bs';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
        const versionDiff = semver.diff(
          String(incomingVersion),
          String(featurePopupString)
        );
        if (versionDiff === null) {
          // If no difference, then we do not show,
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

  const handleOpenChange = (isOpen: boolean) => {
    setShowFeaturePopup(isOpen);
    !isOpen && setFeaturePopupString(process.env.NEXT_PUBLIC_TABOO_AI_VERSION);
  };

  return (
    <Dialog
      defaultOpen={showFeaturePopup}
      open={showFeaturePopup}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className='h-[90%] w-[95%] rounded-lg'>
        <article
          data-testid='content-article'
          className='leading-snug h-full overflow-y-scroll scrollbar-hide'
        >
          <ReactMarkdown className='pb-8'>{content}</ReactMarkdown>
          <div className='sticky bottom-4 w-full flex px-2 justify-center'>
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
