import {GoogleGenerativeAI} from '@google/generative-ai'
const geminiProApiKey = process.env.GOOGLE_GEMINI_PRO_API_KEY ?? '';
const googleAI = new GoogleGenerativeAI(geminiProApiKey);

export const googleGeminiPro = googleAI.getGenerativeModel({
  model: 'gemini-pro'
})