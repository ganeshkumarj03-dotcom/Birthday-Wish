import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateUniqueWish = async (name: string, style: 'funny' | 'heartfelt' | 'poetic'): Promise<string> => {
  try {
    const prompt = `Write a short, unique, and ${style} birthday wish for a friend named ${name}. 
    Make it creative and memorable. Keep it under 60 words. Do not include quotes around the text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Minimize latency
        temperature: 0.8,
      }
    });

    return response.text || "Happy Birthday! May your day be as awesome as you are!";
  } catch (error) {
    console.error("Error generating wish:", error);
    return `Happy Birthday, ${name}! Wishing you a day filled with joy and laughter (and maybe some cake)!`;
  }
};