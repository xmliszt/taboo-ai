import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';
import { getFullWordList } from '../../../lib/services/backend/wordService';
import IWord from '../../../types/word.interface';

interface WordListResponse {
  words: IWord[];
}

const wordListHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<WordListResponse | { error: string }>
) => {
  if (req.method === 'GET') {
    const words = await getFullWordList();
    if (!words) {
      res.status(500).json({ error: 'Unable to get word list' });
    }
    res.status(200).json({
      words,
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default withMiddleware(wordListHandler);
