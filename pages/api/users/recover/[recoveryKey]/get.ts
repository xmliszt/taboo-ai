import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../../lib/middleware/middlewareWrapper';
import { getUserByRecoveryKey } from '../../../../../lib/services/backend/userService';

const getUserByRecoveryKeyHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const { recoveryKey } = req.query;
    if (!recoveryKey || typeof recoveryKey !== 'string') {
      return res.status(400).json({ error: 'RecoveryKey is required' });
    }
    try {
      const user = await getUserByRecoveryKey(recoveryKey as string);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
      } else {
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

export default withMiddleware(getUserByRecoveryKeyHandler);
