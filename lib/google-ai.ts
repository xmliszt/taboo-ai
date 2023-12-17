import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';

const geminiProApiKey = process.env.GOOGLE_GEMINI_PRO_API_KEY ?? '';
const googleAI = new GoogleGenerativeAI(geminiProApiKey);

const safetySettings: SafetySetting[] = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
  }
]

export const googleGeminiPro = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  safetySettings
});