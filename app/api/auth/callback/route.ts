import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabaseClient = createClient(cookieStore);
    await supabaseClient.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(request.url).origin);
}
