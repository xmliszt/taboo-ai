import type { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../../lib/middleware/middlewareWrapper';
import { updateLastLoginAt } from '../../../../../lib/services/backend/userService';

const updateLastLoginHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ error: string; details?: string }>
) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nickname, recoveryKey } = req.query;
  if (!nickname || !recoveryKey) {
    return res
      .status(400)
      .json({ error: 'Nickname and recoveryKey are required' });
  }

  const { lastLoginAt } = req.body;
  if (!lastLoginAt) {
    return res.status(400).json({ error: 'lastLoginAt is required' });
  }

  try {
    await updateLastLoginAt(
      nickname.toString(),
      recoveryKey.toString(),
      lastLoginAt
    );
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Server Error', details: error.message });
  }
};

export default withMiddleware(updateLastLoginHandler);
