import type { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../../lib/middleware/middlewareWrapper';
import { addDeviceToUser } from '../../../../../lib/services/backend/userService';

const addUserDeviceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const { nickname, recoveryKey } = req.query;
    const { device } = req.body;
    try {
      await addDeviceToUser(
        nickname as string,
        recoveryKey as string,
        device as string
      );
      res.status(200).json({ message: 'Device added successfully' });
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

export default withMiddleware(addUserDeviceHandler);
