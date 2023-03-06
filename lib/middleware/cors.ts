import { NextApiRequest, NextApiResponse } from 'next';

const trustedOrigins = ['https://taboo-ai.vercel.app'];
// if (process.env.VERCEL_ENV === 'development') {
//   trustedOrigins.push('http://0.0.0.0');
// }

const checkOrigin = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const origin = req.headers.origin;
  if (origin && !trustedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Invalid origin' });
  }
  next();
};

export default checkOrigin;
