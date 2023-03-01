import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const isGPTOutage = Boolean(process.env.CHATGPT_OUTAGE);
  if (req.method === 'GET') {
    try {
      res.json({ isGPTOutage });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.end();
  }
}
