'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BookMarked } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TabooPathname } from '@/lib/utils/routeUtils';
import Link from 'next/link';
import moment from 'moment';
import Stripe from 'stripe';
import { Skeleton } from '../skeleton';
import { useAuth } from '@/components/auth-provider';

interface ProfileSubscriptionCardProps {
  className?: string;
}

export default function ProfileSubscriptionCard({
  className,
}: ProfileSubscriptionCardProps) {
  const { userPlan, status } = useAuth();
  const router = useRouter();

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

  const renderSubscriptionDetails = (
    status: Stripe.Subscription.Status | undefined
  ) => {
    switch (status) {
      case 'trialing':
        return (
          <>
            <div className='flex flex-row justify-between items-center leading-tight'>
              <div className='italic text-muted-foreground'>
                You are currently on free trial
              </div>
            </div>
            <div className='flex flex-row justify-between items-center leading-tight'>
              <div>Your trial ends in: </div>
              <div className='flex flex-row gap-2 items-center'>
                {userPlan?.trialEndDate?.diff(moment(), 'days')}
                <span>days</span>
              </div>
            </div>
          </>
        );
      case 'active':
        return (
          <>
            <div className='flex flex-row justify-between items-center leading-tight'>
              <div>Next billing cycle: </div>
              <div className='flex flex-row gap-2 items-center'>
                {userPlan?.nextBillingDate?.format('DD MMM YYYY')}
              </div>
            </div>
          </>
        );
      default:
        return (
          status && (
            <>
              <div className='flex flex-row justify-between items-center leading-tight'>
                {getInvalidPlanMessage(status)}
              </div>
            </>
          )
        );
    }
  };

  return (
    <Card className={cn(className)} id='subscription'>
      <CardContent>
        <CardHeader className='p-0 my-4'>
          <BookMarked />
          <CardTitle>My Subscription</CardTitle>
        </CardHeader>
        <CardDescription>Manage your subscription here.</CardDescription>
        {status === 'loading' ? (
          <Skeleton className='my-4' />
        ) : userPlan === undefined ? (
          <div className='mt-6 w-full flex flex-col gap-2'>
            <div className='flex flex-row justify-between items-center leading-tight'>
              <div className='text-destructive'>
                Sorry something went wrong!
              </div>
            </div>
          </div>
        ) : (
          <div className='mt-6 w-full flex flex-col gap-2'>
            <div className='flex flex-row justify-between items-center leading-tight'>
              <div>You are subscribed to:</div>
              <div className='flex flex-row gap-2 items-center'>
                <Badge>{userPlan?.type?.toUpperCase() ?? 'FREE'}</Badge>
                <span>plan</span>
              </div>
            </div>
            {renderSubscriptionDetails(userPlan?.status)}
            <Button
              className={cn(
                'mt-4',
                userPlan?.type === 'free' && 'animate-pulse'
              )}
              onClick={() => {
                router.push(TabooPathname.PRICING);
              }}
            >
              {userPlan?.type === 'free'
                ? 'Upgrade Your Plan'
                : 'Change Your Plan'}
            </Button>
          </div>
        )}
        <div className='leading-tight text-muted-foreground text-sm mt-4'>
          Found your subscription incorrect?{' '}
          <Link
            href='mailto:xmliszt@gmail.com?subject=Issue: Incorrect Subscription on Taboo AI'
            className='underline'
          >
            Raise a request
          </Link>{' '}
          and we will help you resolve the issue as soon as possible.
        </div>
      </CardContent>
    </Card>
  );
}
