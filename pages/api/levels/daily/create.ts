import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { submitNewDailyLevel } from '../../../../lib/services/backend/levelService';
import IDailyLevel from '../../../../types/dailyLevel.interface';

const createDailyLevelHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    try {
      const level = req.body as IDailyLevel;
      const newLevel = await submitNewDailyLevel(level);
      res.status(201).json({ level: newLevel });
    } catch (err) {
      res.status(500).json({
        error: 'Unable to create new daily level.',
        details: err.message,
      });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default withMiddleware(createDailyLevelHandler);
