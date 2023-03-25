import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { getDailyLevel } from '../../../../lib/services/backend/levelService';

const getDailyLevelHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const { date } = req.query;
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Date is required!' });
    }
    const requestDate = moment(date, 'DD-MM-YYYY');
    if (requestDate.isAfter(moment(), 'day')) {
      return res
        .status(400)
        .json({ error: 'Requesting future daily level is not allowed!' });
    }
    try {
      const newLevel = await getDailyLevel(date as string);
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
