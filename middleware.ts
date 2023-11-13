import { log } from '@/lib/logger';
import { bold, yellow } from 'ansis';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import checkAuth from '@/middleware/auth+middleware';
import checkRateLimit from '@/middleware/rateLimit+middleware';
import checkOrigin from '@/middleware/cors+middleware';

export function middleware(request: NextRequest) {
  // Log the request to the console using ansis
  log(bold(`[${request.method}]: `), yellow(request.nextUrl.pathname));
  const response = NextResponse.next({
    request,
  });
  let error = checkOrigin(request, response);
  if (error) return new NextResponse(error.message, { status: error.status });
  error = checkRateLimit(request);
  if (error) return new NextResponse(error.message, { status: error.status });
  return response;
}
