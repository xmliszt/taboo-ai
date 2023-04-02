import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../../lib/middleware/middlewareWrapper';
import { getScoresByGameID } from '../../../../lib/services/backend/scoreService';
import { IScore } from '../../../../types/score.interface';

interface GetScoresByGameIDHandler {
  scores: IScore[];
  error?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

const getScoresByIDHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<GetScoresByGameIDHandler | ErrorResponse>
) => {
  if (req.method !== 'GET') {
    return res.status(405).send({ error: 'Method not allowed.' });
  }

  const { game_id } = req.query;
  if (!game_id || typeof game_id !== 'string') {
    res.status(400).json({ error: 'Game id parameter is required' });
    return;
  }
  try {
    const scores = await getScoresByGameID(game_id);
    if (scores) {
      return res.status(200).send({ scores });
    } else {
      return res
        .status(404)
        .send({ error: 'Unable to fetch scores at the moment!' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      error: `Error fetching scores by Game ID - ${game_id}.`,
      details: error.message,
    });
  }
};

export default withMiddleware(getScoresByIDHandler);
