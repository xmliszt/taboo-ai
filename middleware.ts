import { NextResponse, type NextRequest } from 'next/server';

import { track } from '@/lib/logsnag/logsnag-server';
import { createClient } from '@/lib/utils/supabase/middleware';
import checkOrigin from '@/middleware/cors+middleware';

import { TabooPathname } from './lib/utils/routeUtils';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);
  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const session = await supabase.auth.getSession();

  // Check origin
  const error = checkOrigin(request, response);
  if (error) return new NextResponse(error.message, { status: error.status });

  // TODO - Rate limit is not available in Edge runtime. Requires alternative solution.

  // Track navigation: only track those pathname exists in the routes
  const pathname = request.nextUrl.pathname;
  const matchedPathname = Object.values(TabooPathname)
    .filter((path) => path !== '/')
    .find(
      (route) =>
        pathname.startsWith(route) ||
        /^\/level\//.test(pathname) ||
        /^\/checkout\/success/.test(pathname)
    );
  if (matchedPathname) {
    await track({
      channel: 'navigation',
      event: 'navigate',
      icon: '🔍',
      user_id: session.data.session?.user.id,
      notify: false,
      tags: {
        pathname: pathname,
        search: request.nextUrl.search,
        origin: request.nextUrl.origin,
        referrer: request.headers.get('referer') || 'no referrer',
        user_agent: request.headers.get('user-agent') || 'no user agent',
      },
    });
  }
  return response;
}
