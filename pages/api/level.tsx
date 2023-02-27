import { NextApiRequest, NextApiResponse } from 'next';
import ILevel from '../../app/levels/(models)/level.interface';
import { queryAllLevels } from '../../lib/db/levelRespository';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { levels } = await queryAllLevels();
      const convertedLevels: ILevel[] = levels.map((level): ILevel => {
        return {
          name: level.name as string,
          difficulty: level.difficulty as number,
          author: level.author as string,
          new: level.new as boolean,
          words: (level.words as string).split(','),
        };
      });
      res.json({ levels: convertedLevels });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.end();
  }
}
