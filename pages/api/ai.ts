import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../lib/middleware/middlewareWrapper';
import { IChat } from '../../lib/types/score.interface';

const aiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).json({ error: 'No API Key provided!' });
  if (req.method === 'POST') {
    const system = req.body.system;
    const prompts = req.body.prompt as IChat[];
    const temperature = parseFloat(req.body.temperature);
    const maxToken = parseInt(req.body.maxToken);

    const messages: IChat[] = [];
    if (system && typeof system === 'string') {
      messages.push({
        role: 'system',
        content: system,
      });
    }
    if (prompts !== undefined) {
      for (const prompt of prompts) {
        messages.push(prompt);
      }
    }
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
            messages: messages,
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
      } else if (json.choices.length > 0) {
        const responseText = json.choices[0].message.content;
        res.status(200).json({ response: responseText });
      } else {
        res.status(200).json({ response: null });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.end();
  }
};

export default withMiddleware(aiHandler);
