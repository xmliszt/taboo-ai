import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect');

  if (code) {
    const supabaseClient = createClient(cookies());
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  // If request.url is localhost, use http instead of https
  const url = new URL(request.url);
  const protocol = url.hostname === 'localhost' ? 'http' : 'https';
  let redirectUrl = `${protocol}://${url.hostname}`;
  if (url.port) redirectUrl += `:${url.port}`;
  if (redirect) redirectUrl += redirect;
  return NextResponse.redirect(redirectUrl);
}
