import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';
import ILevel from '../../app/levels/(models)/level.interface';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'levels.json');
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      let levels = JSON.parse(jsonData).levels as ILevel[];
      levels = levels.map((level) => {
        return {
          ...level,
          difficulty: Number(level.difficulty),
        };
      });
      res.json({ levels });
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    res.end();
  }
}
