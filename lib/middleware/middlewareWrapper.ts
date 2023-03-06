import { NextApiRequest, NextApiResponse } from 'next';
import rateLimitMiddleware from '../middlewares/rateLimitMiddleware';
import getIp from '../utils';
import checkOrigin from './cors';

const aiApiRateLimiter = rateLimitMiddleware({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

// Middleware route handler
const withMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Apply the middleware function
    try {
      const ip_address = getIp(req);
      if (ip_address) {
        await aiApiRateLimiter.check(res, 10, ip_address);
      } else {
        return res
          .status(400)
          .json({ error: 'IP address cannot be determined' });
      }
    } catch {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    checkOrigin(req, res, () => {
      handler(req, res);
    });
  };
};

export default withMiddleware;
