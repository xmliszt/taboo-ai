import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../../lib/middleware/middlewareWrapper';
import { getHighlightsByIDs } from '../../../../../lib/services/backend/highlightService';
import { IHighlight } from '../../../../../types/chat.interface';

interface GetHighlightsByIDsResponse {
  highlights: IHighlight[];
  error?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const getHighlightsByIDsHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetHighlightsByIDsResponse | ErrorResponse>
) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'Method not allowed.' });
  }

  const { game_id, score_id } = req.query;
  if (!game_id || typeof game_id !== 'string') {
    res.status(400).json({ error: 'Game id parameter is required' });
    return;
  }
  if (!score_id || Number.isNaN(Number(score_id))) {
    res.status(400).json({ error: 'Score id parameter is required' });
    return;
  }
  try {
    const highlights = await getHighlightsByIDs(game_id, Number(score_id));
    if (highlights) {
      return res.status(200).send({ highlights });
    } else {
      return res
        .status(404)
        .send({ error: 'Unable to fetch highlights at the moment!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: `Error fetching highlights by Game ID - ${game_id} & Score ID - ${score_id}.`,
      details: error.message,
    });
  }
};

export default withMiddleware(getHighlightsByIDsHandler);
