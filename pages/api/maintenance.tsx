import { NextApiRequest, NextApiResponse } from 'next';

interface IOutageData {
  isGPTOutage: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
}
