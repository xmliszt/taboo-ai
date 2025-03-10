'use client';

import { useEffect, useState } from 'react';
import FeaturePopupContent from 'mdx-contents/release-notes.mdx';
import { BsDiscord } from 'react-icons/bs';
import semver from 'semver';

import SocialLinkButton from '@/components/custom/social-link-button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getFeaturePopupString, setFeaturePopupString } from '@/lib/cache';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

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
      // There is no version, so we show feature popup as this is first time.
      displayFeaturePopup();
      return;
    }
    if (incomingVersion) {
      // If we have incoming version, we compare it with the feature popup version.
      try {
        const versionDiff = semver.diff(String(incomingVersion), String(featurePopupString));
        if (versionDiff === null) {
          semver.gt(incomingVersion, featurePopupString) && setFeaturePopupString(incomingVersion);
          return;
        }
        if (versionDiff === 'patch') return;
        const isIncomingVersionNewer = semver.gt(incomingVersion, featurePopupString);
        if (isIncomingVersionNewer) {
          displayFeaturePopup();
          return;
        } else {
          return;
        }
      } catch {
        return;
      }
    }
  }, []);

  const displayFeaturePopup = () => {
    setShowFeaturePopup(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setShowFeaturePopup(isOpen);
    // If user closes the popup, we update local storage.
    if (!isOpen) {
      // pop up is about new feature, we update the version.
      setFeaturePopupString(process.env.NEXT_PUBLIC_TABOO_AI_VERSION);
    }
  };

  return (
    <Dialog defaultOpen={showFeaturePopup} open={showFeaturePopup} onOpenChange={handleOpenChange}>
      <DialogContent className='h-[90%] w-[95%] grow rounded-lg p-0'>
        <ScrollArea className='h-full w-full px-4'>
          <div className='flex h-full min-h-[calc(100vh-10rem)] flex-col justify-between'>
            <article data-testid='content-article' className='h-full py-8 leading-snug'>
              <FeaturePopupContent />
            </article>
            <div className='sticky bottom-4 flex w-full justify-center px-2'>
              <SocialLinkButton
                content='Join Discord Community'
                icon={<BsDiscord />}
                href='https://discord.gg/dgqs29CHC2'
                newTab={true}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
