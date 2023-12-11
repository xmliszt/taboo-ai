import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

/**
 * This route creates a Stripe Billing Portal session for the customer,
 * and then redirects the customer to the portal.
 */
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error: 'Stripe secret key not set',
      },
      { status: 500 }
    );
  }
  const body = await req.json();
  const customerId = body.customerId;
  const redirectUrl = body.redirectUrl;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  if (!customerId) {
    return NextResponse.json(
      {
        error: 'Customer ID not provided',
      },
      { status: 400 }
    );
  }
  if (!redirectUrl) {
    return NextResponse.json(
      {
        error: 'Redirect URL not provided',
      },
      { status: 400 }
    );
  }
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: redirectUrl,
  });

  const portalSessionUrl = portalSession.url;
  return NextResponse.json({
    portalSessionUrl: portalSessionUrl,
  });
}
