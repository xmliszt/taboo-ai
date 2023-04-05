import { NextApiRequest, NextApiResponse } from 'next';
import { getIp } from '../utilities';
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
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  // Apply the middleware function
  const ipAddress = getIp(req);
  if (!ipAddress) {
    return res.status(400).json({ error: 'IP address cannot be determined' });
  }
  if (req.url) {
    switch (true) {
      case /api\/ai/.test(req.url):
        aiRateLimiter
          .check(res, 20, ipAddress)
          .then(() => {
            next();
          })
          .catch(() => {
            return res.status(429).json({ error: 'Rate limit exceeded' });
          });
        break;
      default:
        normalRateLimiter
          .check(res, 100, ipAddress)
          .then(() => {
            next();
          })
          .catch(() => {
            return res.status(429).json({ error: 'Rate limit exceeded' });
          });
        break;
    }
  } else {
    next();
  }
};

export default checkRateLimit;
