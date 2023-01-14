import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import ILevel from "../../app/levels/(models)/level.interface";
import { uniqueId } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const filePath = path.join(process.cwd(), "levels.json");
      const jsonData = fs.readFileSync(filePath, "utf-8");
      var levels = JSON.parse(jsonData).levels as ILevel[];
      levels = levels.map((level, idx) => {
        return {
          ...level,
          difficulty: Number(level.difficulty),
          id: uniqueId(),
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
