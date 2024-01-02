import { NextResponse, type NextRequest } from 'next/server';
import { bold, yellow } from 'ansis';

import { log } from '@/lib/logger';
import { createClient } from '@/lib/utils/supabase/middleware';
import checkOrigin from '@/middleware/cors+middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  // Log the request to the console using ansis
  log(bold(`[${request.method}]: `), yellow(request.nextUrl.pathname));

  // Check origin
  const error = checkOrigin(request, response);
  if (error) return new NextResponse(error.message, { status: error.status });

  // TODO - Rate limit is not available in Edge runtime. Requires alternative solution.
  return response;
}
