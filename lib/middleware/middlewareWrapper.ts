import { NextApiRequest, NextApiResponse } from 'next';
import checkOrigin from './cors+middleware';
import checkRateLimit from './rateLimit+middleware';

// Middleware route handler
const withMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    checkRateLimit(req, res, () => {
      checkOrigin(req, res, () => {
        handler(req, res);
      });
    });
  };
};

export default withMiddleware;
