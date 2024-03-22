'use client';

import { useEffect, useState } from 'react';
import { BsDiscord } from 'react-icons/bs';
import semver from 'semver';

import SocialLinkButton from '@/components/custom/social-link-button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFeaturePopupString, setFeaturePopupString } from '@/lib/cache';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

import FeatureContentMDX from './content.mdx';

export default function FeaturePopup() {
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const incomingVersion = process.env.NEXT_PUBLIC_TABOO_AI_VERSION;

  useEffect(() => {
    const eventHandler = EventManager.bindEvent(CustomEventKey.CLOSE_FEATURE_POPUP, () => {
      handleOpenChange(false);
    });

    return () => {
      EventManager.removeListener(CustomEventKey.CLOSE_FEATURE_POPUP, eventHandler);
    };
  }, []);

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
      <DialogContent className='h-[90%] w-[95%] rounded-lg p-0'>
        <ScrollArea className='w-full px-4'>
          <article data-testid='content-article' className='h-full py-8 leading-snug'>
            <FeatureContentMDX />
            <div className='sticky bottom-4 flex w-full justify-center px-2'>
              <SocialLinkButton
                content='Join Discord Community'
                icon={<BsDiscord />}
                href='https://discord.gg/dgqs29CHC2'
                newTab={true}
              />
            </div>
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
