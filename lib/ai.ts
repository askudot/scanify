import OpenAI from "openai";

export function getAIClient() {
  return new OpenAI({
    apiKey: process.env.AI_API_KEY || "none",
    baseURL: process.env.AI_BASE_URL || "http://localhost:20128/v1",
  });
}

export const AI_MODEL = process.env.AI_MODEL || "xmtp/mimo-v2.5-pro";
