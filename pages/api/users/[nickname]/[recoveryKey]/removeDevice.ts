import type { NextApiRequest, NextApiResponse } from 'next';
import { removeDeviceFromUser } from '../../../../../lib/services/userService';

export default async function removeUserDevice(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
