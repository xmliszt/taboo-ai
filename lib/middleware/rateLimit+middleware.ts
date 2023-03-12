import { NextApiRequest, NextApiResponse } from 'next';
import getIp from '../utils';
import RateLimiter from './rateLimiter';

const rateLimiter = RateLimiter({
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
  rateLimiter
    .check(res, 10, ipAddress)
    .then(() => {
      next();
    })
    .catch(() => {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    });
};

export default checkRateLimit;
