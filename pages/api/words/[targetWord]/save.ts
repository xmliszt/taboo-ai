import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { saveTabooWords } from '../../../../lib/services/backend/wordService';

interface SaveTabooWordsRequest {
  variations: string[];
}

interface SaveTabooWordsResponse {
  success: boolean;
}

interface ErrorResponse {
  error: string;
}

const saveTabooWordsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<SaveTabooWordsResponse | ErrorResponse>
) => {
  const { targetWord } = req.query;
  if (!targetWord || typeof targetWord !== 'string') {
    res.status(400).json({ error: 'Target word parameter is required' });
    return;
  }
  if (req.method === 'POST') {
    const { variations }: SaveTabooWordsRequest = req.body;
    await saveTabooWords({ target: targetWord, variations });
    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default withMiddleware(saveTabooWordsHandler);
