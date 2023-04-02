import type { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import {
  createUser,
  getUserByNickname,
} from '../../../lib/services/backend/userService';
import type IUser from '../../../types/user.interface';

const createUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ user: IUser } | { error: string; details?: string }>
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nickname, userAgent } = req.body;
  if (!nickname || typeof nickname !== 'string') {
    return res.status(400).json({ error: 'Nickname is required' });
  }

  if (!userAgent) {
    return res.status(400).json({ error: 'User Agent is required' });
  }

  const nicknameValue = nickname as string;
  const usernameRegex = /^[a-zA-Z0-9-]+$/;
  const isValid =
    nicknameValue.match(usernameRegex) &&
    nicknameValue.length <= 12 &&
    nicknameValue.length > 0;
  if (!isValid) {
    return res.status(400).json({ error: 'Nickname is mal-formatted' });
  }

  const user = await getUserByNickname(nicknameValue);

  if (!user) {
    try {
      const user = await createUser(nicknameValue, userAgent);
      return res.status(201).json({ user });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: 'Server Error', details: error.message });
    }
  } else {
    return res.status(409).json({ error: 'User already exists!' });
  }
};

export default withMiddleware(createUserHandler);
