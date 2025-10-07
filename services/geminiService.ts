import { GoogleGenAI } from "@google/genai";

// IMPORTANT: Set your API key in the environment variables.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> => {
  if (!text.trim()) {
    return '';
  }

  // A more robust prompt to ensure only the translation is returned with higher accuracy.
  const prompt = `You are a highly specialized translation engine. Your sole function is to translate the following text.
- Translate from: ${sourceLang}
- Translate to: ${targetLang}

Important instructions:
1. When translating to or from 'Kurdish (Badini)', ensure the translation uses the Badini dialect of Kurdish.
2. Your output must contain ONLY the translated text.
3. Do not add any extra words, explanations, or quotation marks around the translation.

Original text:
---
${text}
---
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 } // For faster response on simple tasks
      },
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error during translation with Gemini API:", error);
    // Provide a more user-friendly error message
    throw new Error("Failed to get a response from the translation service. Please try again later.");
  }
};