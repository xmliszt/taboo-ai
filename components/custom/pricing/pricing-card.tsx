'use client';

import { Check, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Spinner } from '../spinner';
import {
  cancelSubscription,
  createCheckoutSession,
} from '@/lib/services/subscriptionService';
import { ISubscriptionPlan } from '@/lib/types/subscription-plan.type';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth-provider';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { LoginReminderProps } from '../globals/login-reminder-dialog';
import { confirmAlert } from '../globals/generic-alert-dialog';
import moment from 'moment';

interface PricingCardProps {
  index: number;
  plan: ISubscriptionPlan;
}

export default function PricingCard({ index, plan }: PricingCardProps) {
  const { user, status, userPlan, refreshUserSubscriptionPlan } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const actionLabel =
    userPlan === undefined
      ? plan.type === 'free'
        ? 'Current Plan' // If not logged in, free plan is current plan
        : 'Start Free Trial' // If not logged in, paid plan is start free trial
      : userPlan.type === plan.type
      ? 'Current Plan' // If logged in, current plan is current plan
      : userPlan.tier ?? 0 > plan.tier
      ? 'Downgrade Plan' // If logged in and current plan is higher tier than this plan, downgrade plan
      : user?.customerId === undefined
      ? 'Start Free Trial' // If logged in and current plan is lower tier than this plan, but not a Stripe customer before, start free trial
      : 'Upgrade Plan'; // If logged in and current plan is lower tier than this plan, upgrade plan
  const isCurrentPlan =
    userPlan === undefined ? plan.type === 'free' : userPlan.type === plan.type;
  const subscriptionCancelledAt = userPlan?.subscription?.cancel_at;
  const subscriptionCancelDate = subscriptionCancelledAt
    ? moment(subscriptionCancelledAt * 1000)
    : undefined;

  const subscribeTo = async (priceId?: string) => {
    // If subscription is already cancelled, do not allow to subscribe again
    if (subscriptionCancelDate) {
      return confirmAlert({
        title: 'You have already cancelled your subscription',
        description: `You have already cancelled your subscription. Your subscription will end on ${subscriptionCancelDate.format(
          'DD MMM YYYY'
        )}. You can still use the paid features until then. After that, you will automatically switch to FREE plan.`,
        hasConfirmButton: false,
        cancelLabel: 'OK',
      });
    }
    // If it is a free plan, it does not have priceId, its type is 'free'.
    if (!priceId || plan.type === 'free') {
      // user is currently trialing and not cancelled, show cancel trial dialog
      if (userPlan?.status === 'trialing') {
        return confirmAlert({
          title: 'You are already on a free trial',
          description:
            "You are already on a free trial. If you'd like to downgrade to a free plan, you can simply cancel your current subscription and you will automatically switch back to free plan after your trial ends.",
          cancelLabel: 'OK',
          confirmLabel: 'Cancel my current subscription',
          onConfirm: () => {
            downgradeToFreePlan();
          },
        });
      }
      // user is on active subscription and not cancelled, show downgrade dialog
      if (userPlan?.status === 'active') {
        return confirmAlert({
          title: 'Downgrade to FREE plan',
          description:
            'Are you sure you want to downgrade to FREE plan? You will lose all the features of your current plan after your current subscription period ends. You will still have access to paid features until then.',
          onConfirm: () => {
            downgradeToFreePlan();
          },
        });
      }
      // Other cases where subscription is not active or trialing
      return confirmAlert({
        title: 'You do not have an active paid subscription',
        description:
          'You do not have an active paid subscription. Once your current paid subscription ends, you will automatically switch to FREE plan.',
        hasConfirmButton: false,
        cancelLabel: 'OK',
      });
    }
    // If user is not logged in, show login reminder
    if (status !== 'authenticated') {
      return EventManager.fireEvent<LoginReminderProps>(
        CustomEventKey.LOGIN_REMINDER,
        {
          title: 'You need to login to subscribe',
          redirectHref: '/pricing',
        }
      );
    }
    // user logged in, selected paid plan and valid, create checkout session
    try {
      setIsLoading(true);
      const redirectUrl = await createCheckoutSession(
        priceId,
        user?.email,
        user?.customerId
      );
      router.replace(redirectUrl);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downgradeToFreePlan = async () => {
    if (!userPlan?.subId) {
      return toast({
        title: 'We could not fetch an active subscription to cancel.',
        variant: 'destructive',
      });
    }
    try {
      setIsLoading(true);
      await cancelSubscription(userPlan?.subId);
      confirmAlert({
        title: 'Your subscription has been cancelled',
        description:
          'You will still have access to paid features until your current subscription period ends. After that, you will automatically switch to FREE plan.',
        hasConfirmButton: false,
        cancelLabel: 'OK',
        onCancel: () => {
          router.push('/profile?anchor=subscription');
        },
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Something went wrong. We could not downgrade your plan.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // scroll first card into view
    if (isCurrentPlan) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    refreshUserSubscriptionPlan?.();
  }, []);

  return (
    <Card
      id={`plan-card-${index}`}
      ref={cardRef}
      className={cn(
        /pro/i.test(plan.name)
          ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]'
          : '',
        user?.customerPlanType === plan.type
          ? 'border-[1px] border-primary'
          : '',
        'relative max-h-[480px] min-h-[480px] max-w-[280px] min-w-[280px] snap-center hover:scale-105 transition-transform ease-in-out mt-12'
      )}
    >
      <CardHeader>
        <CardTitle>
          <div className='flex flex-row justify-between items-center'>
            {plan.name}
            {plan.type !== 'free' && (
              <Badge>{plan.trialsDays} days free trial</Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription className='text-xl'>
          ${plan.pricePerMonth} per month
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 h-full mb-24'>
        {plan.features.map((feature, index) => (
          <div
            key={index}
            className='flex flex-row gap-2 justify-start items-start'
          >
            <div className='w-[22px]'>
              {feature.status === 'absent' ? (
                <X size={20} color='#E54666' strokeWidth={2} />
              ) : (
                <Check
                  size={20}
                  color={
                    feature.status === 'complete' ? '#7eb262' : '#7eb26250'
                  }
                  strokeWidth={2}
                />
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <span
                  className={cn(
                    'leading-tight underline underline-offset-2 decoration-dotted hover:cursor-help',
                    feature.status === 'absent'
                      ? 'text-muted-foreground'
                      : 'text-primary'
                  )}
                >
                  {feature.title}{' '}
                </span>
              </PopoverTrigger>
              <PopoverContent className='leading-snug bg-muted text-card-foreground'>
                <p className='leading-tight text-base'>{feature.description}</p>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
      <CardFooter className='flex justify-center absolute bottom-0 w-full left-0 z-10'>
        <Button
          className='w-full'
          disabled={isCurrentPlan || isLoading}
          onClick={() => {
            subscribeTo(plan.priceId);
          }}
        >
          {isLoading ? <Spinner /> : actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
