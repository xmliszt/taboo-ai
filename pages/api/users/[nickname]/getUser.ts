import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByNickname } from '../../../../lib/services/userService';

export default async function getUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { nickname } = req.query;
    try {
      const user = await getUserByNickname(nickname as string);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
