import { NextApiRequest, NextApiResponse } from 'next';
import rateLimitMiddleware from '../../lib/middlewares/rateLimitMiddleware';
import getIp from '../../lib/utils';

const aiApiRateLimiter = rateLimitMiddleware({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).send({ error: 'No API Key provided!' });
  try {
    const ip_address = getIp(req);
    if (ip_address) {
      await aiApiRateLimiter.check(res, 10, ip_address);
      if (req.method === 'POST') {
        const prompt = req.body.prompt;
        const temperature = parseFloat(req.body.temperature);
        const maxToken = parseInt(req.body.maxToken);

        try {
          const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + apiKey,
              },
              body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                  {
                    role: 'user',
                    content: prompt,
                  },
                ],
                temperature: Number.isNaN(temperature) ? 0.9 : temperature,
                max_tokens: Number.isNaN(maxToken) ? 500 : maxToken,
                n: 1,
                stop: ['[]', '{}'],
              }),
            }
          );
          const json = await response.json();
          if (json.error) {
            res.status(500).json(json.error);
            return;
          }
          const responseText =
            json.choices[0].message.content ?? "Sorry I don't quite get it.";
          res.status(200).send({ response: responseText });
        } catch (err) {
          res.status(500).end(err);
        }
      } else {
        res.end();
      }
    } else {
      res.status(400).json({ error: 'IP address cannot be determined' });
    }
  } catch {
    res.status(429).json({ error: 'Rate limit exceeded' });
  }
}
