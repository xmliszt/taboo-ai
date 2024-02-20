'use client';

import { useState } from 'react';
import { Skull } from 'lucide-react';
import { toast } from 'sonner';

import { deleteUser } from '@/app/profile/server/delete-user';
import { UserProfile } from '@/app/profile/server/fetch-user-profile';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { Spinner } from '../spinner';

type ProfileDangerZoneProps = {
  user: UserProfile;
  className?: string;
};
export function ProfileDangerZone(props: ProfileDangerZoneProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const proceedToDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await deleteUser();
      toast.info('Your account has been deleted.');
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error(error);
      toast.error('Sorry, we are unable to delete the user right now. Please try again later!');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={cn(props.className, 'border-red-500 text-red-600')}>
        <CardContent>
          <CardHeader className='my-4 p-0'>
            <Skull />
            <CardTitle>Danger zone</CardTitle>
          </CardHeader>
          <CardDescription>
            Once you have deleted your account, there is no going back. All your data with us will
            be permanently deleted.{' '}
            <b>
              Your active subscription will also be cancelled. However, your ongoing paid
              subscription (including trial) will still be available until the end of the billing
              cycle when you sign in with the same email account.
            </b>{' '}
            Please be certain.
          </CardDescription>
          <Button
            className='mt-4'
            variant='destructive'
            onClick={() => {
              setIsConfirmOpen(true);
            }}
          >
            Delete my account
          </Button>
        </CardContent>
      </Card>
      <AlertDialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-destructive'>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              The action cannot be undone. This will permanently delete your account and remove all
              your data from our server.{' '}
              <b>
                Your current subscription will also be cancelled automatically. However, your
                ongoing subscription will still be available until the end of the billing cycle when
                you sign in with the same email account.
              </b>{' '}
              This action is <b>irreversible</b>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={proceedToDeleteUser}>
              {isDeleting ? <Spinner /> : 'Delete my account'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
