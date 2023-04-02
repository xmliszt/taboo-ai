import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import {
  getDailyLevel,
  getDailyLevelByName,
} from '../../../../lib/services/backend/levelService';

const getDailyLevelHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'GET') {
    const { date, name } = req.query;
    if (!date && !name) {
      return res.status(400).json({ error: 'Date or name is required!' });
    }
    if (date) {
      // const requestDate = moment(date, 'DD-MM-YYYY');
      // if (requestDate.isAfter(moment(), 'day')) {
      //   return res
      //     .status(400)
      //     .json({ error: 'Requesting future daily level is not allowed!' });
      // }
      try {
        const newLevel = await getDailyLevel(date as string);
        if (!newLevel) {
          return res.status(404).json({ error: 'No daily level found!' });
        } else {
          return res.status(200).json({ level: newLevel });
        }
      } catch (err) {
        return res.status(500).json({
          error: 'Unable to get daily level.',
          details: err.message,
        });
      }
    }
    if (name) {
      try {
        const level = await getDailyLevelByName(name as string);
        if (!level) {
          return res.status(404).json({ error: 'No daily level found!' });
        } else {
          return res.status(200).json({ level: level });
        }
      } catch (err) {
        return res.status(500).json({
          error: 'Unable to get daily level.',
          details: err.message,
        });
      }
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default withMiddleware(getDailyLevelHandler);
