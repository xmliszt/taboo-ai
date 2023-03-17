import type { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../../lib/middleware/middlewareWrapper';
import { removeDeviceFromUser } from '../../../../../lib/services/backend/userService';

const removeUserDeviceHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'DELETE') {
    const { nickname, recoveryKey } = req.query;
    const { deviceIndex } = req.body;
    try {
      await removeDeviceFromUser(
        nickname as string,
        recoveryKey as string,
        parseInt(deviceIndex as string)
      );
      res.status(200).json({ message: 'Device removed successfully' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Internal server error', details: error.message });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};

export default withMiddleware(removeUserDeviceHandler);
