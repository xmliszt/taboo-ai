import type { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../../lib/middleware/middlewareWrapper';
import { deleteUserByNicknameAndRecoveryKey } from '../../../../../lib/services/backend/userService';

const deleteUserHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ error: string; details?: string }>
) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { nickname, recoveryKey } = req.query;
  if (!nickname || !recoveryKey) {
    return res
      .status(400)
      .json({ error: 'Nickname and recoveryKey are required' });
  }

  try {
    await deleteUserByNicknameAndRecoveryKey(
      nickname.toString(),
      recoveryKey.toString()
    );
    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: 'Server Error', details: error.message });
  }
};

export default withMiddleware(deleteUserHandler);
