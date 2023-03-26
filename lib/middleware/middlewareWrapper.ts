import chalk from 'chalk';
import { NextApiRequest, NextApiResponse } from 'next';
import { log } from '../logger';
import checkOrigin from './cors+middleware';
import checkRateLimit from './rateLimit+middleware';

// Middleware route handler
const withMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>
) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    log(chalk.bold(`[${req.method}]`, chalk.yellow(req.url)));
    checkRateLimit(req, res, () => {
      checkOrigin(req, res, () => {
        handler(req, res);
      });
    });
  };
};

export default withMiddleware;
