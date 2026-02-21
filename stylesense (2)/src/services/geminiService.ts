import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface OutfitRecommendation {
  title: string;
  description: string;
  items: {
    category: string;
    item: string;
    description: string;
  }[];
  stylingTips: string[];
}

export async function generateOutfitRecommendation(prompt: string): Promise<OutfitRecommendation> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction: `You are a world-class fashion stylist. 
      Generate a personalized outfit recommendation based on the user's input.
      Return the response in JSON format.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                item: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["category", "item", "description"]
            }
          },
          stylingTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "description", "items", "stylingTips"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateOutfitImage(outfitDescription: string): Promise<string | null> {
  const model = "gemini-2.5-flash-image";
  
  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          text: `A high-end fashion editorial photograph of a complete outfit: ${outfitDescription}. 
          The style should be elegant, professional lighting, clean background, high fashion aesthetic. 
          Show the full outfit clearly.`
        }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return null;
}
