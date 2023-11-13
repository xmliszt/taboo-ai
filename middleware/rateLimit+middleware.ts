import { NextRequest, NextResponse } from 'next/server';
import RateLimiter from './rateLimiter';

const aiRateLimiter = RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const normalRateLimiter = RateLimiter({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const checkRateLimit = (
  req: NextRequest
): { status: number; message: string } | undefined => {
  // Apply the middleware function
  const ipAddress =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.ip;
  if (!ipAddress) return;
  if (req.url) {
    console.log(req.url);
    const res = NextResponse.next(req);
    switch (true) {
      case /api\/ai$/.test(req.url):
        if (aiRateLimiter.check(res, 20, ipAddress))
          return { status: 429, message: 'Rate limit exceeded' };
        break;
      case /api\/mail$/.test(req.url):
      case /api\/x\/mail$/.test(req.url):
        if (aiRateLimiter.check(res, 10, ipAddress))
          return { status: 429, message: 'Rate limit exceeded' };
        break;
      default:
        if (aiRateLimiter.check(res, 100, ipAddress))
          return { status: 429, message: 'Rate limit exceeded' };
        break;
    }
  }
};

export default checkRateLimit;
