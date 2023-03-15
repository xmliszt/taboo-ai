import type { NextApiRequest, NextApiResponse } from 'next';
import { addDeviceToUser } from '../../../../../lib/services/userService';

export default async function addUserDevice(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
}
