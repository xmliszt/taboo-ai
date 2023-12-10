import { plans as availablePlans } from '@/app/api/subscriptions/plans/route';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        message: 'Stripe secret key not set',
      },
      { status: 500 }
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.get('origin');
  if (!origin)
    return NextResponse.json(
      { message: 'Origin header not set' },
      { status: 500 }
    );

  let priceId: string;
  let customerEmail: string;
  let customerId: string;

  try {
    const body = await req.json();
    priceId = body.priceId;
    customerEmail = body.customerEmail;
    customerId = body.customerId;
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to parse request body' },
      { status: 400 }
    );
  }
  if (!priceId)
    return NextResponse.json({ message: 'Plan id not set' }, { status: 500 });

  // Refetch the plans just to make sur
  const targetPlan = availablePlans.find((plan) => plan.priceId === priceId);
  if (!targetPlan) {
    return NextResponse.json({ message: 'Plan not found' }, { status: 404 });
  }

  // Check if customer already has a subscription
  if (customerId) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
      });
      if (subscriptions.data.length > 0) {
        return NextResponse.json(
          { message: 'Customer already has a subscription' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode }
        );
      } else {
        return NextResponse.json(
          { message: 'Failed to fetch subscriptions' },
          { status: 500 }
        );
      }
    }
  }

  // Check by email if customer already has a subscription
  if (customerEmail) {
    try {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      if (customers.data.length > 0) {
        const customer = customers.data[0];
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
        });
        if (subscriptions.data.length > 0) {
          return NextResponse.json(
            { message: 'Customer already has a subscription' },
            { status: 400 }
          );
        }
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Stripe.errors.StripeError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode }
        );
      } else {
        return NextResponse.json(
          { message: 'Failed to fetch subscriptions' },
          { status: 500 }
        );
      }
    }
  }

  const checkoutSessionCreateParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription', // mode should be subscription
    line_items: [
      {
        price: targetPlan.priceId, // price id
        quantity: 1,
      },
    ],
    payment_method_collection: 'always',
    success_url: `${origin}/checkout/success/{CHECKOUT_SESSION_ID}`, // Success redirect to user's profile subscription section
    cancel_url: `${origin}/pricing`,
  };

  if (customerId) {
    checkoutSessionCreateParams.customer = customerId;
  } else {
    checkoutSessionCreateParams.customer_email = customerEmail;
    // If customer ID not present, that means the user is new to Stripe, so we set the trial period
    checkoutSessionCreateParams.subscription_data = {
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel', // If user doesn't add payment method, cancel the subscription after trial ends
        },
      },
      trial_period_days: targetPlan.trialsDays,
    };
  }

  try {
    const session = await stripe.checkout.sessions.create(
      checkoutSessionCreateParams
    );
    if (!session.url) {
      return NextResponse.json(
        { message: 'Stripe session url not set' },
        { status: 500 }
      );
    }
    return NextResponse.json({ redirectUrl: session.url });
  } catch (error) {
    console.error(error);
    if (error instanceof Stripe.errors.StripeError) {
      const { message } = error;
      return NextResponse.json({ message }, { status: error.statusCode });
    } else {
      return NextResponse.json(
        { message: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
  }
}
