import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  const customerId = req.nextUrl.searchParams.get('customerId');
  if (!customerId) {
    return NextResponse.json({ message: 'Customer id not set' }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        message: 'Stripe secret key not set',
      },
      { status: 500 }
    );
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return NextResponse.json({ customer });
  } catch (error) {
    console.error(error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
