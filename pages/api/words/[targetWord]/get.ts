import { NextApiRequest, NextApiResponse } from 'next';
import { getTabooWords } from '../../../../lib/services/backend/wordService';

interface TabooWordsResponse {
  variations: string[];
}

interface ErrorResponse {
  error: string;
}

const tabooWordsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<TabooWordsResponse | ErrorResponse>
) => {
  const { targetWord } = req.query;
  if (!targetWord || typeof targetWord !== 'string') {
    res.status(400).json({ error: 'Target word parameter is required' });
    return;
  }
  if (req.method === 'GET') {
    const variations = await getTabooWords(targetWord);
    res.status(200).json({ variations });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default tabooWordsHandler;
