import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';

const aiJudgeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).json({ error: 'No API Key provided!' });
  if (req.method === 'POST') {
    const target = req.body.target;
    const prompt = req.body.prompt;
    const system = `You are the judge of the game of Taboo, where the clue-giver gives textual clue for guessing the word "${target}". You will judge the creativity level, knowledge level of the prompt. The more informative, more creative, more meaningful, the higher the score. Be lenient. Guesser is an AI who knows everything. Give zero if clue uses letter constraints, letter manipulation, direct translations to English, partial word combinations, ascii conversion, rhymes, grammatical hints.`;
    const user = `Give a score from 0 - 100, assess the prompt: "${prompt}". Output in json format. Example: {"score": 10, "explanation": "explanation"}`;
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
                role: 'system',
                content: system,
              },
              {
                role: 'user',
                content: user,
              },
            ],
            temperature: 1,
            max_tokens: 200,
            n: 1,
            stop: ['{}'],
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
      res.status(500).json({ error: err.message });
    }
  } else {
    res.end();
  }
};

export default withMiddleware(aiJudgeHandler);
