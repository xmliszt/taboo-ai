import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomEventKey, EventManager } from '@/lib/event-manager';

import { Button } from '../ui/button';

interface ShareScoreDialogProps {
  onSharePlainText: () => void;
  onShareScreenshot: () => void;
  onShareCard: () => void;
}

export default function ShareScoreDialog({
  onSharePlainText,
  onShareScreenshot,
  onShareCard,
}: ShareScoreDialogProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    const listener = EventManager.bindEvent(CustomEventKey.SHARE_SCORE, () => {
      setIsShareDialogOpen(true);
    });
    return () => {
      EventManager.removeListener(CustomEventKey.SHARE_SCORE, listener);
    };
  }, []);

  return (
    <Dialog
      key='share-1'
      open={isShareDialogOpen}
      onOpenChange={(open) => {
        setIsShareDialogOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your scores!</DialogTitle>
          <DialogDescription>Choose how you want to share your scores...</DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex flex-row items-center justify-center gap-2'>
          <Button
            onClick={() => {
              setIsShareDialogOpen(false);
              onShareCard();
            }}
          >
            Share Card
          </Button>
          <Button
            onClick={() => {
              setIsShareDialogOpen(false);
              onSharePlainText();
            }}
          >
            Plain Text
          </Button>
          <Button
            onClick={() => {
              setIsShareDialogOpen(false);
              onShareScreenshot();
            }}
          >
            Screenshot
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
