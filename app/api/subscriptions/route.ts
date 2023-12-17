import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe key not found' }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const params = req.nextUrl.searchParams;
  const customerId = params.get('customerId');
  if (!customerId) {
    return NextResponse.json({ error: 'Customer id not found' }, { status: 400 });
  }
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
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
