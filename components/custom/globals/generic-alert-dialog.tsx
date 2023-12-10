'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { useEffect, useRef, useState } from 'react';

type GenericAlertDialogProps = {
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  hasConfirmButton?: boolean;
};

export default function GenericAlertDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('Confirm');
  const [description, setDescription] = useState<string>();
  const [confirmLabel, setConfirmLabel] = useState<string>('Confirm');
  const [cancelLabel, setCancelLabel] = useState<string>('Cancel');
  const [hasConfirmButton, setHasConfirmButton] = useState(true);
  const onConfirm = useRef<() => void>();
  const onCancel = useRef<() => void>();

  useEffect(() => {
    const listener = EventManager.bindEvent<GenericAlertDialogProps>(
      CustomEventKey.GENERIC_ALERT_DIALOG,
      ({ detail }) => {
        setIsOpen(true);
        setTitle(detail.title);
        setDescription(detail.description);
        setConfirmLabel(detail.confirmLabel ?? 'Confirm');
        setCancelLabel(detail.cancelLabel ?? 'Cancel');
        setHasConfirmButton(detail.hasConfirmButton ?? true);
        onConfirm.current = detail.onConfirm;
        onCancel.current = detail.onCancel;
      }
    );
    return () => {
      EventManager.removeListener(
        CustomEventKey.GENERIC_ALERT_DIALOG,
        listener
      );
    };
  }, []);

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel.current?.();
            }}
          >
            {cancelLabel}
          </AlertDialogCancel>
          {hasConfirmButton && (
            <AlertDialogAction
              onClick={() => {
                onConfirm.current?.();
                setIsOpen(false);
              }}
            >
              {confirmLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function confirmAlert(options: GenericAlertDialogProps) {
  EventManager.fireEvent<GenericAlertDialogProps>(
    CustomEventKey.GENERIC_ALERT_DIALOG,
    options
  );
}
