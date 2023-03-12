import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../lib/middleware/middlewareWrapper';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).json({ error: 'No API Key provided!' });
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
        res.status(500).json(json.error); // Return ChatGPT side API error
      } else {
        const responseText = json.choices[0].message.content;
        res.status(200).json({ response: responseText });
      }
    } catch (err) {
      res.status(500).json({ error: err });
    }
  } else {
    res.end();
  }
};

export default withMiddleware(handler);
