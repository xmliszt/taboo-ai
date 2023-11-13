import LRU from 'lru-cache';
import { NextResponse } from 'next/server';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function RateLimiter(options?: Options) {
  const tokenCache = new LRU({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: NextResponse, limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= limit;
      res.headers.set('X-RateLimit-Limit', limit.toString());
      res.headers.set(
        'X-RateLimit-Remaining',
        (isRateLimited ? 0 : limit - currentUsage).toString()
      );

      return isRateLimited;
    },
  };
}
