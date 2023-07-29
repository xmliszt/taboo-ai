import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import { submitNewLevel } from '../../../lib/services/backend/levelService';
import ILevel from '../../../types/level.interface';

const createLevelHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    try {
      const level = req.body as ILevel;
      const newLevel = await submitNewLevel(level);
      res.status(201).json({ level: newLevel });
    } catch (err) {
      res.status(500).json({
        error: 'Unable to create new level.',
        details: err.message,
      });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default withMiddleware(createLevelHandler);
