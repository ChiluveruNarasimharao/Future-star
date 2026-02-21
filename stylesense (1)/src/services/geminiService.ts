import { GoogleGenAI, Type } from "@google/genai";
import { OutfitRecommendation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateOutfitRecommendation = async (
  preferences: string,
  occasion: string,
  weather: string = "mild"
): Promise<OutfitRecommendation> => {
  const prompt = `As a high-end fashion stylist, generate a complete outfit recommendation for the following context:
  - User Style Preferences: ${preferences}
  - Occasion: ${occasion}
  - Current Weather: ${weather}

  Provide a cohesive look including top, bottom, shoes, and accessories.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          occasion: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                color: { type: Type.STRING },
                style: { type: Type.STRING },
              },
              required: ["name", "category", "description", "color", "style"],
            },
          },
          stylingTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["title", "description", "items", "occasion", "stylingTips"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as OutfitRecommendation;
};

export const getFashionTrends = async (): Promise<string[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "What are the top 5 fashion trends for the current season? Provide a list of short, catchy trend names.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};
