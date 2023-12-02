import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = [
  /taboo-ai\.vercel\.app$/,
  /taboo-.+-xmliszt\.vercel\.app$/,
  /taboo-ai-xmliszt-xmliszt-team\.vercel\.app$/,
  /localhost:\d+$/,
  /127\.0\.0\.1:\d+$/,
  /\[::1\]:\d+$/,
  /192\.168\.\d+\.\d+:\d+$/,
  /\[::1\]:\d+$/,
];

const checkOrigin = (
  request: NextRequest,
  response: NextResponse
): { status: number; message: string } | undefined => {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && allowedOrigins.some((allowedOrigin) => allowedOrigin.test(origin))) {
    // set response header
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (!origin && host && allowedOrigins.some((allowedOrigin) => allowedOrigin.test(host))) {
    response.headers.set('Access-Control-Allow-Origin', host);
  } else {
    return {
      status: 403,
      message: 'Forbidden',
    };
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
};

export default checkOrigin;
