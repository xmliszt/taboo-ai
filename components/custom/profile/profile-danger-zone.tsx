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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skull } from 'lucide-react';
import { useState } from 'react';
import { deleteUser, getAuth } from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '../spinner';
import { deleteUserFromFirebase } from '@/lib/services/userService';
import { useRouter } from 'next/navigation';

const auth = getAuth();

export default function ProfileDangerZone({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const proceedToDeleteUser = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      setIsDeleting(true);
      user.email && (await deleteUserFromFirebase(user.email));
      await deleteUser(user);
      toast({ title: 'Your account has been deleted.' });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        title:
          'Sorry, we are unable to delete the user right now. Please try again later!',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className={cn(className, 'border-red-500 text-red-600')}>
        <CardContent>
          <CardHeader className='p-0 my-4'>
            <Skull />
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardDescription>
            Once you delete your account, there is no going back. All your data
            with us will be permanently deleted. Please be certain.
          </CardDescription>
          <Button
            className='mt-4'
            variant='destructive'
            onClick={() => {
              setIsConfirmOpen(true);
            }}
          >
            Delete My Account
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
              The action cannot be undone. This will permanently delete your
              account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={proceedToDeleteUser}>
              {isDeleting ? <Spinner /> : 'Continue'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
