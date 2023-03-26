import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { isWordVariationsExist } from '../../../../lib/services/backend/wordService';

const wordExistsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<{ exists: boolean } | { error: string }>
) => {
  const { targetWord } = req.query;
  if (!targetWord || typeof targetWord !== 'string') {
    res.status(400).json({ error: 'Word parameter is required' });
    return;
  }
  const exists = await isWordVariationsExist(targetWord);
  res.status(200).json({ exists });
};

export default withMiddleware(wordExistsHandler);
