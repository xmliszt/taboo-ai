import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { plans } from '@/app/api/subscriptions/plans/route';
import { SubscriptionPlanType } from '@/lib/types/subscription-plan.type';
import { createClient } from '@/lib/utils/supabase/server';

const createStripeCustomerForUser = async (
  userId: string,
  customerId: string,
  customerPlanType: SubscriptionPlanType
) => {
  const supabaseClient = createClient(cookies());
  const { data, error } = await supabaseClient
    .from('subscriptions')
    .insert({
      user_id: userId,
      customer_id: customerId,
      customer_plan_type: customerPlanType,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        message: 'Stripe secret key not set',
      },
      { status: 500 }
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const url = new URL(req.nextUrl.toString());
  const sessionId = url.searchParams.get('session');
  if (!sessionId) {
    return NextResponse.json(
      {
        message: 'Session id not set',
      },
      { status: 500 }
    );
  }
  // Update a user document with customerId
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const customer = (await stripe.customers.retrieve(session.customer as string, {
      expand: ['subscriptions'],
    })) as Stripe.Customer;
    if (!customer) {
      return NextResponse.json(
        {
          message: 'Customer not found',
        },
        { status: 500 }
      );
    }
    const email = customer.email;
    if (!email) {
      return NextResponse.json(
        {
          message: 'Customer email not found',
        },
        { status: 500 }
      );
    }
    try {
      const planID = customer.subscriptions?.data[0].items.data[0].plan.id;
      const subscribedPlan = plans.find((plan) => plan.priceId === planID);
      if (!subscribedPlan) {
        console.error('Subscribed plan not found');
        return NextResponse.json(
          {
            message:
              'Failed to create stripe customer in DB for user: ' +
              email +
              ' with customer ID: ' +
              customer.id,
          },
          { status: 500 }
        );
      }
      await createStripeCustomerForUser(userId, customer.id, subscribedPlan.type);
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message:
            'Failed to create stripe customer in DB for user: ' +
            email +
            ' with customer ID: ' +
            customer.id,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    } else {
      return NextResponse.json({ message: 'Failed to retrieve stripe session' }, { status: 500 });
    }
  }
}
