import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllUsers } from '../../../lib/services/userService';
import type IUser from '../../../types/user.interface';

export default async function createUserHandler(
  req: NextApiRequest,
  res: NextApiResponse<{ users: IUser[] } | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const users = await getAllUsers();
    return res.status(201).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}
