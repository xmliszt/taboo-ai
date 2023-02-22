import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).send({ error: 'No API Key provided!' });
  if (req.method === 'POST') {
    const prompt = req.body.prompt;
    const temperature = parseFloat(req.body.temperature);
    const maxToken = parseInt(req.body.maxToken);

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
          model: 'text-curie-001',
          prompt,
          temperature: Number.isNaN(temperature) ? 0.9 : temperature,
          max_tokens: Number.isNaN(maxToken) ? 500 : maxToken,
          n: 1,
          stop: ['[]', '{}'],
        }),
      });
      const json = await response.json();
      if (json.error) {
        res.status(500).json(json.error);
        return;
      }
      const responseText =
        json.choices[0].text ?? "Sorry I don't quite get it.";
      res.status(200).send({ response: responseText });
    } catch (err) {
      res.status(500).end(err);
    }
  } else {
    res.end();
  }
}
