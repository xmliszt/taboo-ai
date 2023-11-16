import { OpenAI, ClientOptions } from 'openai';

const openaiConfig: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION_ID,
};

export const openai = new OpenAI(openaiConfig);
