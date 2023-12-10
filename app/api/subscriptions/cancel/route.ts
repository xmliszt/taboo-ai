import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * Cancel an active subscription from Stripe. The subscription will be cancelled at the end of the current billing period.
 * @searchParams subId: The subscription ID from Stripe
 */
export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe key not found' },
      { status: 500 }
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const params = req.nextUrl.searchParams;
  const subscriptionID = params.get('subId');
  if (!subscriptionID) {
    return NextResponse.json(
      { error: 'Subscription id not found' },
      { status: 400 }
    );
  }
  try {
    const subscription = await stripe.subscriptions.update(subscriptionID, {
      cancel_at_period_end: true,
    });
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error(error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
