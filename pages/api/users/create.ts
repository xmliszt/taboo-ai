import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../lib/services/userService';
import type IUser from '../../../types/user.interface';

export default async function createUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<{ user: IUser } | { error: string }>
) {
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

  try {
    const user = await createUser(nickname, userAgent);
    return res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}
