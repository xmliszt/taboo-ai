import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { getDailyLevel } from '../../../../lib/services/backend/levelService';

const getDailyLevelHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    try {
      const newLevel = await getDailyLevel();
      if (!newLevel) {
        res.status(404).json({ error: 'No daily level found!' });
      } else {
        res.status(200).json({ level: newLevel });
      }
    } catch (err) {
      res.status(500).json({
        error: 'Unable to get daily level.',
        details: err.message,
      });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default withMiddleware(getDailyLevelHandler);
