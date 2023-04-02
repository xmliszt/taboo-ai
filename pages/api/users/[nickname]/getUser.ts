import { NextApiRequest, NextApiResponse } from 'next';
import { CONSTANTS } from '../../../../lib/constants';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { getUserByNickname } from '../../../../lib/services/backend/userService';

const getUserHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { nickname } = req.query;
    try {
      const user = await getUserByNickname(nickname as string);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
        user.recovery_key = CONSTANTS.mask;
        res.status(200).json(user);
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Internal server error', details: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default withMiddleware(getUserHandler);
