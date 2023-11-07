import { NextApiRequest, NextApiResponse } from 'next';
import withMiddleware from '../../../lib/middleware/withMiddleware';

const aiJudgeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const apiKey = process.env.OPENAI_API;
  if (!apiKey) return res.status(500).json({ error: 'No API Key provided!' });
  if (req.method === 'POST') {
    const target = req.body.target;
    const prompt = req.body.prompt;
    if (target === undefined || prompt === undefined) {
      return res.status(400).json({ error: 'Missing target word or prompt' });
    }
    const system = `You are a judge in the Game of Taboo. In this game, player is given a target word for guesser to guess. Player gives hints to the guesser and guesser replied in a conversation. Player cannot use any of the provided taboo words or the target word, which includes any part of the word or abbreviations of those words. Players are not allowed to use phrases like  “sounds like” or “rhymes with”. Players are also prohibited from using any sound effects or gestures to demonstrate the word. Players cannot use direct translation from other languages as hints. Players cannot purposely misspell the word or re-arrange its letter as hints.\nYour task is to judge and evaluate the quality of the clues given by the player in this game, from the following angles: Creative, Descriptive, Correct Gramma, No Cheating. You can provide improvement tips. You will be given the entire conversation formatted as the example below:\n\n===\n\nExample Input:\n"target": "moon", "conversation":"P:Do you know the story about Chang e and Hou Yi?||G:Yes, I am familiar with the story of Chang'e and Hou Yi.||P:So in the end Chang e went to where?||G:In the end, Chang'e went to the moon." }\n\n---\nP: represents the player who gives the hints.\nG: represents the guesser who tries to guess the word.\n||: separator between player and guesser content\n---\n\nExample Output: \n{"score": 80, "explanation": "Player uses a creative approach that associate the target word 'moon' with the Ancient Chinese story about Hou Yi and Chang e. A minor suggestion is to correct the grammar in the second hint into 'So, where did Chang e go to in the end?'.  Hence, I will give a score of 90/100"}\n\n===\n\nExample Input:\n{"target": "moon", "conversation":"P:月亮的中文||G:moon" }\n\nExample Output:\n{"score": 0, "explanation": "Direction translation from other language is not allowed. Hence, I will give a score of 0/100"}\n\n===\n\nExample Input:\n"target": "moon", "conversation":"P:onom form which word?||G:moon" }\n\nExample Output\n{"score": 0, "explanation": "Player is trying to cheat by rearranging the letters of the target word. Hence, I will give a score of 0/100"}\n\n===\n\nExample Input:\n{"target": "moon", "conversation":"P:moom||G:Do you mean moon?" }\n\nExample Output\n{"score": 0, "explanation": "Player is trying to cheat by deliberately spelling the target word wrong. Hence, I will give a score of 0/100"}`;
    const user = `{"target": "${target}", "conversation":"${prompt}" }`;
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
            model: 'gpt-4-1106-preview',
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
            temperature: 0.2,
            max_tokens: 256,
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
