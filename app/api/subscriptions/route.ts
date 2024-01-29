import { NextRequest, NextResponse } from 'next/server';

import {
  fetchUserSubscriptionsFromStripe,
  fetchUserSubscriptionsFromStripeWithEmail,
} from '@/app/profile/server/fetch-subscriptions-from-stripe';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const customerId = searchParams.get('customer_id');
  const userEmail = searchParams.get('customer_email');
  if (!customerId && !userEmail) {
    return new Response('No customer_id or email provided', {
      status: 400,
    });
  }
  const subscriptions = customerId
    ? await fetchUserSubscriptionsFromStripe(customerId)
    : await fetchUserSubscriptionsFromStripeWithEmail(userEmail!);
  if (subscriptions.length === 0) {
    return NextResponse.json({
      subscription: null,
    });
  }
  return NextResponse.json({
    subscription: subscriptions[0],
  });
}
