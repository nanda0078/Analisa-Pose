import { GoogleGenAI, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are an expert AI Prompt Engineer and Computer Vision analyst. 
Your task is to analyze the provided image and extract specific details to create a high-quality prompt for AI image generators like Midjourney or Stable Diffusion.

Focus on:
1. Pose Description: Detailed body position, orientation, and gestures.
2. Clothing/Subject Brief: What the subject is wearing or their key physical characteristics.
3. Background Environment: Detailed setting, objects in the background, and depth.
4. Lighting/Atmosphere: Type of light, mood, and color palette.

Output MUST be in JSON format with the following structure:
{
  "pose": "string",
  "clothing": "string",
  "background": "string",
  "lighting": "string"
}

Be descriptive but concise. Use professional photography and art terminology.`;

export async function analyzeImage(base64Image: string, mimeType: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please configure it in the Secrets panel.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "Analyze this image for pose and background extraction." },
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pose: { type: Type.STRING },
          clothing: { type: Type.STRING },
          background: { type: Type.STRING },
          lighting: { type: Type.STRING },
        },
        required: ["pose", "clothing", "background", "lighting"],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Failed to analyze image content correctly.");
  }
}
