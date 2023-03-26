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
  if (!nickname) {
    return res.status(400).json({ error: 'Nickname is required' });
  }

  if (!userAgent) {
    return res.status(400).json({ error: 'User Agent is required' });
  }

  const user = await getUserByNickname(nickname);

  if (!user) {
    try {
      const user = await createUser(nickname, userAgent);
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
