import { NextApiRequest, NextApiResponse } from 'next';

const allowedOrigins = [
  /taboo-ai\.vercel\.app$/,
  /taboo-.+-xmliszt\.vercel\.app$/,
  /localhost:\d+$/,
  /192\.168\.\d+\.\d+:\d+$/,
];

const checkOrigin = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (
    origin &&
    allowedOrigins.some((allowedOrigin) => allowedOrigin.test(origin))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (
    !origin &&
    host &&
    allowedOrigins.some((allowedOrigin) => allowedOrigin.test(host))
  ) {
    res.setHeader('Access-Control-Allow-Origin', host);
  } else {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
};

export default checkOrigin;
