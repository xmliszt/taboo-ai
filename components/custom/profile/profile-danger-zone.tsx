import { useState } from 'react';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
import { Skull } from 'lucide-react';

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
import { useToast } from '@/components/ui/use-toast';
import { cancelSubscription, fetchCustomerSubscriptions } from '@/lib/services/subscriptionService';
import { deleteUserFromSupabase } from '@/lib/services/userService';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/utils/supabase/server';

import { Spinner } from '../spinner';

export default function ProfileDangerZone({ className }: { className?: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const proceedToDeleteUser = async () => {
    const supabaseClient = createClient(cookies());
    const userResponse = await supabaseClient.auth.getUser();
    if (userResponse.error) {
      toast({
        title: 'We cannot identify the user to be deleted. Please retry login and try again.',
        variant: 'destructive',
      });
      return;
    }
    const user = userResponse.data.user;
    const fetchUserSubscription = await supabaseClient
      .from('subscriptions')
      .select()
      .eq('user_id', user.id)
      .single();
    if (fetchUserSubscription.error) {
      toast({
        title:
          'We cannot identify the user subscription to be deleted. Please retry login and try again.',
        variant: 'destructive',
      });
      return;
    }
    if (!user.email) {
      toast({
        title: 'We cannot identify the user to be deleted. Please retry login and try again.',
        variant: 'destructive',
      });
      return;
    }
    const userSubscription = await fetchCustomerSubscriptions(
      user.email,
      fetchUserSubscription.data.customer_id
    );

    // Start deleting
    try {
      setIsDeleting(true);
      await deleteUserFromSupabase(user.id); // Supabase delete user
      userSubscription?.subId && (await cancelSubscription(userSubscription.subId)); // If subscription ID presents, cancel the subscription from Stripe
      toast({ title: 'Your account has been deleted.' });
      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Sorry, we are unable to delete the user right now. Please try again later!',
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
          <CardHeader className='my-4 p-0'>
            <Skull />
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardDescription>
            Once you delete your account, there is no going back. All your data with us will be
            permanently deleted.{' '}
            <b>
              Your active subscription will also be cancelled. However, you ongoing paid
              subscription (including trial) will still be available until the end of the billing
              cycle if you log in with the same email account again.
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
              The action cannot be undone. This will permanently delete your account and remove all
              your data from our server.{' '}
              <b>
                Your current subscription will also be cancelled automatically. However, you ongoing
                subscription will still be available until the end of the billing cycle if you log
                in with the same email account again.
              </b>{' '}
              This action is <b>irreversible</b>.
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
