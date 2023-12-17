import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * Fetch user's subscriptions by email
 */
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe key not found' }, { status: 500 });
  }
  const body = await req.json();
  const email = body.email;
  if (!email) {
    return NextResponse.json(
      {
        error: 'No email provided',
      },
      { status: 400 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const customer = await stripe.customers.list({
      email: email,
      limit: 1,
    });
    if (customer.data.length === 0) {
      return NextResponse.json(
        {
          error: 'No customer found',
        },
        { status: 404 }
      );
    }
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.data[0].id,
    });
    return NextResponse.json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.error(error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
