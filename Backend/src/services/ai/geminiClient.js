import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const callGemini = async (prompt, temperature = 0.3) => {
  try {
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or "gemini-3-flash-preview"
      contents: `
You are an AI assistant that always responds with valid JSON.
Never include explanatory text outside the JSON structure.

${prompt}
      `,
      generationConfig: {
        temperature,
        responseMimeType: "application/json"
      }
    });

    const processingTime = Date.now() - startTime;

    return {
      content: response.text,
      tokens: {
        prompt: response.usageMetadata?.promptTokenCount || 0,
        completion: response.usageMetadata?.candidatesTokenCount || 0,
        total: response.usageMetadata?.totalTokenCount || 0
      },
      model: "gemini-3-flash-preview",
      processingTime
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`AI service error: ${error.message}`);
  }
};