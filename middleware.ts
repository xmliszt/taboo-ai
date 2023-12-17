import { NextResponse, type NextRequest } from 'next/server';
import { bold, yellow } from 'ansis';

import { log } from '@/lib/logger';
// import checkAuth from '@/middleware/auth+middleware';
// import checkRateLimit from '@/middleware/rateLimit+middleware';
import checkOrigin from '@/middleware/cors+middleware';

export function middleware(request: NextRequest) {
  // Log the request to the console using ansis
  log(bold(`[${request.method}]: `), yellow(request.nextUrl.pathname));
  const response = NextResponse.next({
    request,
  });
  const error = checkOrigin(request, response);
  if (error) return new NextResponse(error.message, { status: error.status });
  // FIXME - Rate limit is not available in Edge runtime. Requires alternative solution.
  // error = checkRateLimit(request);
  // if (error) return new NextResponse(error.message, { status: error.status });
  return response;
}
