import { auth } from '@/lib/firebase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

export interface AuthNextAPIRequest extends NextApiRequest {
  uid?: string;
}

export const checkAuth = async (
  req: AuthNextAPIRequest,
  res: NextApiResponse,
  next: () => void
) => {
  if (!req.url || !/api\/x/.test(req.url)) {
    return next();
  }
  const token = req.headers.token as string;
  if (!token) {
    return res.status(401).end('Not authenticated. No user token.');
  }

  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid)
      return res.status(401).end('Not authenticated');
    req.uid = decodedToken.uid;
  } catch (error) {
    console.log(error.errorInfo);
    const errorCode = error.errorInfo.code;
    error.status = 401;
    if (errorCode === 'auth/internal-error') {
      error.status = 500;
    }
    //TODO handlle firebase admin errors in more detail
    return res.status(error.status).json({ error: errorCode });
  }

  next();
};
