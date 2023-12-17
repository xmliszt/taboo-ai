import { NextRequest } from 'next/server';

import { auth } from '@/firebase/firebase-admin';

export const checkAuth = async (
  request: NextRequest
): Promise<{ status: number; message: string } | undefined> => {
  const token = request.headers.get('token');
  if (!token) return { status: 401, message: 'Not authenticated. No user token.' };
  // verify token
  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken || !decodedToken.uid)
      return { status: 401, message: 'Not authenticated. Invalid user token.' };
    if (decodedToken.uid !== 'BnlcfMNIvrf2XCxY73O5KXmYNkI3')
      return { status: 401, message: 'Not authenticated. Invalid user token.' };
  } catch (error) {
    console.log(error.errorInfo);
    const errorCode = error.errorInfo.code as string;
    error.status = 401;
    if (errorCode === 'auth/internal-error') {
      error.status = 500;
    }
    return { status: error.status, message: errorCode };
  }
};
