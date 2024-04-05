'use client';

import { useEffect, useState } from 'react';
import WeeklyDropContentMDX from 'mdx-contents/weekly-drop.mdx';
import FeaturePopupContent from 'mdx-contents/whatsnew.mdx';
import moment from 'moment';
import { BsDiscord } from 'react-icons/bs';
import semver from 'semver';

import { Confetti } from '@/app/checkout/success/[session_id]/confetti';
import { useAuth } from '@/components/auth-provider';
import SocialLinkButton from '@/components/custom/social-link-button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getFeaturePopupString,
  getWeeklyTopicsPopupString,
  setFeaturePopupString,
  setWeeklyTopicsPopupString,
} from '@/lib/cache';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

export default function FeaturePopup() {
  const { user } = useAuth();
  // If user is not logged in, we switch off the feature popup feature.
  const featurePopupGlobalSwitchOff = !user;

  const [showFeaturePopup, setShowFeaturePopup] = useState(false);
  const [shouldShowWeeklyDrop, setShouldShowWeeklyDrop] = useState(false);
  const incomingVersion = process.env.NEXT_PUBLIC_TABOO_AI_VERSION;
  const weeklyDropDate = process.env.NEXT_PUBLIC_WEEKLY_DROP_DATE;

  useEffect(() => {
    const eventHandler = EventManager.bindEvent(CustomEventKey.CLOSE_FEATURE_POPUP, () => {
      handleOpenChange(false);
    });

    return () => {
      EventManager.removeListener(CustomEventKey.CLOSE_FEATURE_POPUP, eventHandler);
    };
  }, []);

  function processWeeklyDropDate(weeklyDropDateFromLocalStorage: string | null) {
    // compare the weekly drop date with the local storage date
    if (!weeklyDropDateFromLocalStorage) {
      // if there is no date in local storage, we set it
      setShouldShowWeeklyDrop(true);
      displayFeaturePopup();
      return;
    }
    if (moment(weeklyDropDate).isAfter(moment(weeklyDropDateFromLocalStorage))) {
      // if the date in local storage is older than the current date, we update it
      setShouldShowWeeklyDrop(true);
      displayFeaturePopup();
      return;
    }
    // if the date in local storage is the same or newer than the current date, we do not show the weekly drop
    setShowFeaturePopup(false);
  }

  useEffect(() => {
    const weeklyTopicsPopupString = getWeeklyTopicsPopupString();
    const featurePopupString = getFeaturePopupString();
    if (!featurePopupString) {
      // There is no version, so we show feature popup as this is first time.
      if (featurePopupGlobalSwitchOff) {
        processWeeklyDropDate(weeklyTopicsPopupString);
      } else {
        displayFeaturePopup();
      }
      return;
    }
    if (incomingVersion) {
      // If we have incoming version, we compare it with the feature popup version.
      try {
        const versionDiff = semver.diff(String(incomingVersion), String(featurePopupString));
        if (versionDiff === null) {
          semver.gt(incomingVersion, featurePopupString) && setFeaturePopupString(incomingVersion);
          // If no difference, we try to show weekly drop.
          processWeeklyDropDate(weeklyTopicsPopupString);
          return;
        }
        const isIncomingVersionNewer = semver.gt(incomingVersion, featurePopupString);
        if (isIncomingVersionNewer) {
          // we have newer version, so we show feature popup instead of weekly drop.
          setShouldShowWeeklyDrop(false);
          if (featurePopupGlobalSwitchOff) {
            processWeeklyDropDate(weeklyTopicsPopupString);
          } else {
            displayFeaturePopup();
          }
          return;
        } else {
          // If no difference or order, we try to show weekly drop.
          processWeeklyDropDate(weeklyTopicsPopupString);
          return;
        }
      } catch {
        // If failed to compare, we try to shwo weekly drop.
        processWeeklyDropDate(weeklyTopicsPopupString);
        return;
      }
    }
    // If we have no incoming version, we try to show weekly drop.
    processWeeklyDropDate(weeklyTopicsPopupString);
  }, [featurePopupGlobalSwitchOff]);

  const displayFeaturePopup = () => {
    setShowFeaturePopup(true);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setShowFeaturePopup(isOpen);
    // If user closes the popup, we update local storage.
    if (!isOpen) {
      if (shouldShowWeeklyDrop) {
        // pop up is about weekly drop, we update the date.
        setWeeklyTopicsPopupString(weeklyDropDate);
        setShouldShowWeeklyDrop(false);
      } else {
        // pop up is about new feature, we update the version.
        setFeaturePopupString(process.env.NEXT_PUBLIC_TABOO_AI_VERSION);

        // after this, we check if we should show weekly drop.
        const weeklyTopicsPopupString = getWeeklyTopicsPopupString();
        if (weeklyDropDate) {
          setTimeout(() => {
            processWeeklyDropDate(weeklyTopicsPopupString);
          }, 1500);
        }
      }
    }
  };

  return (
    <Dialog defaultOpen={showFeaturePopup} open={showFeaturePopup} onOpenChange={handleOpenChange}>
      <DialogContent className='h-[90%] w-[95%] rounded-lg p-0'>
        <ScrollArea className='w-full px-4'>
          <article data-testid='content-article' className='h-full py-8 leading-snug'>
            {shouldShowWeeklyDrop ? <WeeklyDropContentMDX /> : <FeaturePopupContent />}
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
      {shouldShowWeeklyDrop && <Confetti playOnce />}
    </Dialog>
  );
}
