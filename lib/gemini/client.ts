import { GoogleGenerativeAI } from "@google/generative-ai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlı değil.");
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModel() {
  const client = getGeminiClient();
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  return client.getGenerativeModel({ model: modelName });
}

export async function generateText(prompt: string): Promise<string> {
  const model = getModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return text.trim();
}
