import { NextApiRequest, NextApiResponse } from 'next';

const allowedOrigins = [
  /^https:\/\/taboo-ai\.vercel\.app$/,
  /^https:\/\/taboo-.+-xmliszt\.vercel\.app$/,
  /^http:\/\/localhost:3000$/,
];

const checkOrigin = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const origin = req.headers.origin;
  if (
    origin &&
    allowedOrigins.some((allowedOrigin) => allowedOrigin.test(origin))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  } else {
    res.status(403).json({ message: 'Forbidden' });
  }
};

export default checkOrigin;
