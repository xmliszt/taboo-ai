import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/middlewareWrapper';

const aiJudgeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).json({ error: 'No API Key provided!' });
  if (req.method === 'POST') {
    const target = req.body.target;
    const prompt = req.body.prompt;
    const system = `You are the judge of the game of Taboo, where the clue-giver gives clue for guessing the word "${target}". You will judge the quality of the clue and give accurate score from 0 - 100. Clear clue that demonstrates knowledge or creativity, deserves higher score. Clue gives direct reference or answer should give average score. Broken clue receives low score. Give 0 score if clue uses letter manipulation, direct translations to English, partial word combinations, ascii conversion, rhymes, grammatical hints, ask to list down all possible answers, hints start with or end with certain letters.`;
    const user = `Carefully assess the clue: "${prompt}". Output: {"score": ?, "explanation": ?}`;
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
