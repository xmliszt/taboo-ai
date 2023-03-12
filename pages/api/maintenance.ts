import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../lib/middleware/middlewareWrapper';

interface IOutageData {
  isGPTOutage: boolean;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const outageData: IOutageData = {
    isGPTOutage: false,
  };
  if (process.env.CHATGPT_OUTAGE) {
    outageData.isGPTOutage = JSON.parse(process.env.CHATGPT_OUTAGE);
  }
  if (req.method === 'GET') {
    try {
      res.json(outageData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.end();
  }
};

export default withMiddleware(handler);
