'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import moment from 'moment';
import { toast } from 'sonner';

import { createCheckoutSession } from '@/app/pricing/server/create-checkout-session';
import { Plan } from '@/app/pricing/server/fetch-plans';
import { cancelStripeSubscription } from '@/app/profile/server/cancel-stripe-subscription';
import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CustomEventKey, EventManager } from '@/lib/event-manager';
import { cn } from '@/lib/utils';

import { confirmAlert } from '../globals/generic-alert-dialog';
import { LoginReminderProps } from '../globals/login-reminder-dialog';
import { Spinner } from '../spinner';

interface PricingCardProps {
  index: number;
  plan: Plan;
}

export default function PricingCard({ index, plan }: PricingCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const actionLabel =
    user?.subscription === undefined
      ? plan.type === 'free'
        ? 'Current Plan' // If not logged in, free plan is the current plan
        : 'Start Free Trial' // If not logged in, paid plan can start a free trial
      : user?.subscription?.customer_plan_type === plan.type
        ? 'Current Plan' // If logged in, current plan is current plan
        : user?.user_plan?.tier ?? 0 > plan.tier
          ? 'Downgrade Plan' // If logged in and current plan is higher tier than this plan, downgrade plan
          : user?.subscription?.customer_id
            ? 'Upgrade Plan' // If logged in and current plan is lower tier than this plan, upgrade plan
            : 'Start Free Trial'; // If logged in and current plan is lower tier than this plan, but not a Stripe customer before, start a free trial
  const isCurrentPlan =
    user?.subscription === undefined
      ? plan.type === 'free'
      : user?.subscription?.customer_plan_type === plan.type;

  const subscriptionCancelledAt = user?.stripeSubscription?.cancel_at;
  const subscriptionCancelDate = subscriptionCancelledAt
    ? moment(subscriptionCancelledAt * 1000)
    : undefined;

  const subscribeTo = async (priceId?: string) => {
    // If the subscription is already cancelled, do not allow subscribing again
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
    // If it is a free plan, it does not have priceId; its type is 'free'.
    if (!priceId || plan.type === 'free') {
      // user is currently trialling and not cancelling, show cancel trial dialogue
      if (user?.stripeSubscription?.status === 'trialing') {
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
      // user is on active subscription and not cancelled, show downgrade dialogue
      if (user?.stripeSubscription?.status === 'active') {
        return confirmAlert({
          title: 'Downgrade to FREE plan',
          description:
            'Are you sure you want to downgrade to FREE plan? You will lose all the features of your current plan after your current subscription period ends. You will still have access to paid features until then.',
          onConfirm: () => {
            downgradeToFreePlan();
          },
        });
      }
      // Other cases where subscription is not active or trialling
      return confirmAlert({
        title: 'You do not have an active paid subscription',
        description:
          'You do not have an active paid subscription. Once your current paid subscription ends, you will automatically switch to FREE plan.',
        hasConfirmButton: false,
        cancelLabel: 'OK',
      });
    }
    // If the user is not logged in, show a login reminder
    if (!user) {
      return EventManager.fireEvent<LoginReminderProps>(CustomEventKey.LOGIN_REMINDER, {
        title: 'You need to login to subscribe',
        redirectHref: '/pricing',
      });
    }
    // user logged in, selected paid plan and valid, create checkout session
    try {
      setIsLoading(true);
      const successRedirectUrl = `${window.location.origin}/checkout/success/{CHECKOUT_SESSION_ID}`; // Success redirect to user's profile subscription section
      const cancelRedirectUrl = `${window.location.origin}/pricing`; // Cancel redirect to pricing page
      const redirectUrl = await createCheckoutSession(
        user,
        plan,
        successRedirectUrl,
        cancelRedirectUrl
      );
      router.replace(redirectUrl);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downgradeToFreePlan = async () => {
    if (!user?.stripeSubscription?.id) {
      return toast.error('We could not fetch an active subscription to cancel.');
    }
    try {
      setIsLoading(true);
      await cancelStripeSubscription(user.stripeSubscription.id);
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
      toast.error('Something went wrong. We could not downgrade your plan.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // scroll first card into view
    if (isCurrentPlan) {
      cardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isCurrentPlan]);

  return (
    <Card
      id={`plan-card-${index}`}
      ref={cardRef}
      className={cn(
        /pro/i.test(plan.name) ? '!shadow-[0px_0px_20px_3px_rgba(255,204,51,1)]' : '',
        user?.subscription?.customer_plan_type === plan.type ? 'border-[1px] border-primary' : '',
        'relative my-12 max-h-[400px] min-h-[400px] min-w-[280px] max-w-[280px] snap-center transition-transform ease-in-out hover:scale-105'
      )}
    >
      <CardHeader className='p-6 pb-4'>
        <CardTitle>
          <div className='flex flex-row items-center justify-between'>
            {plan.name}
            {plan.type !== 'free' && <Badge>{plan.trial_days} days free trial</Badge>}
          </div>
        </CardTitle>
        <CardDescription className='text-base'>${plan.price_per_month} per month</CardDescription>
      </CardHeader>
      <CardContent className='flex h-full flex-col gap-[0.35rem] text-sm'>
        {plan.plan_features.map((feature) => (
          <div key={feature.id} className='flex flex-row items-start justify-start gap-2'>
            <div className='w-[22px]'>
              {feature.status === 'absent' ? (
                <X size={20} color='#E54666' strokeWidth={2} />
              ) : (
                <Check
                  size={20}
                  color={feature.status === 'complete' ? '#7eb262' : '#7eb26250'}
                  strokeWidth={2}
                />
              )}
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <span
                  className={cn(
                    'leading-tight underline decoration-dotted underline-offset-2 hover:cursor-help',
                    feature.status === 'absent' ? 'text-muted-foreground' : 'text-primary'
                  )}
                >
                  {feature.title}{' '}
                </span>
              </PopoverTrigger>
              <PopoverContent className='bg-muted leading-snug text-card-foreground'>
                <p className='text-base leading-tight'>{feature.description}</p>
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </CardContent>
      <CardFooter className='absolute bottom-0 left-0 z-10 flex w-full justify-center'>
        <Button
          className='w-full'
          disabled={isCurrentPlan || isLoading}
          onClick={() => {
            void subscribeTo(plan.price_id ?? undefined);
          }}
        >
          {isLoading ? <Spinner /> : actionLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
