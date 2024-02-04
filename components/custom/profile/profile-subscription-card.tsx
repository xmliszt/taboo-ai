'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookMarked } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';
import Stripe from 'stripe';

import { cancelStripeSubscription } from '@/app/profile/server/cancel-stripe-subscription';
import { createStripeCustomerPortal } from '@/app/profile/server/create-stripe-customer-portal';
import { UserProfileWithStripeSubscription } from '@/app/profile/server/fetch-user-profile';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { TabooPathname } from '@/lib/utils/routeUtils';

import { confirmAlert } from '../globals/generic-alert-dialog';
import { feedback } from '../globals/generic-feedback-dialog';
import { Spinner } from '../spinner';

interface ProfileSubscriptionCardProps {
  user: UserProfileWithStripeSubscription;
  className?: string;
}

export function ProfileSubscriptionCard({ user, className }: ProfileSubscriptionCardProps) {
  const [isCancellingSubscription, setIsCancellingSubscription] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const router = useRouter();

  const subscriptionCancelledAt = user.stripeSubscription?.cancel_at;
  const subscriptionCancelDate = subscriptionCancelledAt
    ? moment(subscriptionCancelledAt * 1000)
    : undefined;
  const userHasCancelledSubscription = subscriptionCancelDate !== undefined;
  const trialEndDate = user.stripeSubscription?.trial_end
    ? moment.unix(user.stripeSubscription.trial_end)
    : undefined;
  const nextBillingDate = user.stripeSubscription
    ? moment.unix(user.stripeSubscription.current_period_end)
    : undefined;

  const proceedToCancelSubscription = async () => {
    try {
      setIsCancellingSubscription(true);
      user.stripeSubscription?.id && (await cancelStripeSubscription(user.stripeSubscription.id));
      setIsConfirmationDialogOpen(false);
      confirmAlert({
        title: 'Your subscription has been cancelled',
        description:
          'You will still have access to paid features until your current subscription period ends. After that, you will automatically switch to FREE plan.',
        hasConfirmButton: false,
        cancelLabel: 'OK',
        onCancel: () => {
          router.refresh();
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. We couldn't cancel your subscription.");
    } finally {
      setIsCancellingSubscription(false);
    }
  };

  const handleManageBilling = async () => {
    if (!user.subscription?.customer_id) return;
    try {
      const portalSessionUrl = await createStripeCustomerPortal(
        user.subscription.customer_id,
        `${window.location.origin}/profile?anchor=subscription`
      );
      router.push(portalSessionUrl);
    } catch (error) {
      console.error(error);
      toast.error('Sorry, we cannot open your billing portal at the moment. Please try again!');
    }
  };

  const getInvalidPlanMessage = (status: Stripe.Subscription.Status) => {
    switch (status) {
      case 'canceled':
        return 'Your subscription has been cancelled.';
      case 'incomplete':
        return 'Your subscription is incomplete.';
      case 'incomplete_expired':
        return 'Your subscription has expired.';
      case 'past_due':
        return 'Your subscription is past due.';
      case 'unpaid':
        return 'Your subscription is unpaid.';
      default:
        return 'Your subscription is invalid.';
    }
  };

  const renderSubscriptionDetails = (status: Stripe.Subscription.Status | undefined) => {
    function renderExpiryDuration() {
      const diffDuration = moment.duration(trialEndDate?.diff(moment()));
      const diffDays = diffDuration.days();
      const diffHours = diffDuration.hours();
      const diffMinutes = diffDuration.minutes();
      if (diffDays > 1) {
        return `${diffDays} days`;
      } else if (diffDays === 1) {
        return `${diffDays} day ${diffHours} hours ${diffMinutes} minutes`;
      } else if (diffHours > 0) {
        return `${diffHours} hours ${diffMinutes} minutes`;
      } else {
        return `${diffMinutes} minutes`;
      }
    }

    switch (status) {
      case 'trialing':
        return (
          <>
            <div className='flex flex-row items-center justify-between leading-tight'>
              <div className='italic text-muted-foreground'>You are currently on free trial</div>
            </div>
            <div className='flex flex-row items-center justify-between leading-tight'>
              <div>Your trial ends in:</div>
              <div className='flex flex-row items-center gap-2'>
                <span>{renderExpiryDuration()}</span>
              </div>
            </div>
          </>
        );
      case 'active':
        if (subscriptionCancelDate) {
          return (
            <div className='flex flex-row items-center justify-between leading-tight'>
              <div>Your subscription will end on: </div>
              <div className='flex flex-row items-center gap-2'>
                {
                  // if is today, show 'today'
                  subscriptionCancelDate.isSame(moment(), 'day')
                    ? 'today'
                    : subscriptionCancelDate.format('DD MMM YYYY')
                }
              </div>
            </div>
          );
        }
        return (
          <div className='flex flex-row items-center justify-between leading-tight'>
            <div>Next billing cycle:</div>
            <div className='flex flex-row items-center gap-2'>
              {nextBillingDate?.format('DD MMM YYYY')}
            </div>
          </div>
        );
      default:
        return status ? (
          <div className='flex flex-row items-center justify-between leading-tight'>
            {getInvalidPlanMessage(status)}
          </div>
        ) : (
          <div className='flex flex-row items-center justify-between text-sm leading-tight text-muted-foreground'>
            You are automatically subscribed to FREE plan.
          </div>
        );
    }
  };

  return (
    <>
      <Card className={cn(className)} id='subscription'>
        <CardContent>
          <CardHeader className='my-4 p-0'>
            <BookMarked />
            <CardTitle>My Subscription</CardTitle>
          </CardHeader>
          <CardDescription>Manage your subscription here.</CardDescription>
          {user.subscription ? (
            <div className='mt-6 flex w-full flex-col gap-2'>
              <div className='flex flex-row items-center justify-between leading-tight'>
                <div>You are on:</div>
                <div className='flex flex-row items-center gap-2'>
                  <Badge>{user.subscription.customer_plan_type?.toUpperCase() ?? 'FREE'}</Badge>
                  <span>plan</span>
                </div>
              </div>
              {renderSubscriptionDetails(user.stripeSubscription?.status)}
              <div className='h-4'></div>
              {user.subscription.customer_id && (
                <Button onClick={handleManageBilling}>Manage Billing & Plan</Button>
              )}
              {!userHasCancelledSubscription && (
                <>
                  <Button
                    className={cn(
                      user.subscription?.customer_plan_type === 'free' && 'animate-pulse'
                    )}
                    onClick={() => {
                      router.push(TabooPathname.PRICING);
                    }}
                  >
                    {user.subscription?.customer_plan_type === 'free'
                      ? 'Upgrade My Plan'
                      : 'Change My Plan'}
                  </Button>
                  {user.subscription?.customer_plan_type !== 'free' && (
                    <Button
                      variant='destructive'
                      onClick={() => {
                        setIsConfirmationDialogOpen(true);
                      }}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </>
              )}
              {userHasCancelledSubscription && subscriptionCancelDate && (
                <p className='text-sm text-muted-foreground'>
                  You have cancelled your subscription. You will still have access to all paid
                  features until {subscriptionCancelDate.format('DD MMM yyyy hh:mm A')}.
                </p>
              )}
            </div>
          ) : (
            <div className='mt-6 flex w-full flex-col gap-2'>
              <div className='italic text-muted-foreground'>
                Sorry, we are having problems fetching your subscription details.
              </div>
              <Button
                size='sm'
                onClick={() => {
                  window.location.reload();
                }}
              >
                Refresh to try again
              </Button>
            </div>
          )}
          <div className='h-3'></div>
          <Separator />
          <div className='mt-4 text-sm leading-tight text-muted-foreground'>
            Found your subscription incorrect?{' '}
            <Button
              variant='link'
              className='p-1 underline'
              size='sm'
              onClick={() => {
                feedback({
                  title: 'Found your subscription incorrect?',
                  description:
                    'Please raise a request and we will help you resolve the issue as soon as possible.',
                  user: user,
                  defaultFeedback: 'Hi! I found my subscription incorrect.',
                });
              }}
            >
              Raise a request
            </Button>{' '}
            and we will help you resolve the issue as soon as possible.
          </div>
        </CardContent>
      </Card>
      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={(open) => {
          setIsConfirmationDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-destructive'>
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your ongoing subscription and you will lose access to all paid
              features after your current subscription period ends.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant='destructive' onClick={proceedToCancelSubscription}>
              {isCancellingSubscription ? <Spinner /> : 'Cancel my subscription'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
