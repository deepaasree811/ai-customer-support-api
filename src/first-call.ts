import { GoogleGenAI } from "@google/genai";

process.loadEnvFile();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-3.6-flash";

const response = await ai.models.generateContent({
    model: MODEL,
    contents: "A customer says hi. Greet them in one short sentence.",
    config: {
        systemInstruction: "You are a friendly support agent for StyleKart, a fashion store.",
    },
});

console.log("Reply:", response.text);
console.log("Usage:", response.usageMetadata);