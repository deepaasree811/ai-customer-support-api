import { GoogleGenAI, type Content } from "@google/genai";

process.loadEnvFile();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION =
    "You are a friendly support agent for StyleKart, a fashion store. " +
    "Address the customer by name if they gave it. Reply in one sentence.";

const withoutHistory = await ai.models.generateContent({
    model: MODEL,
    contents: "What's my name?",
    config: { systemInstruction: SYSTEM_INSTRUCTION },
});
console.log("A) Without history:", withoutHistory.text);

const history: Content[] = [
    { role: "user", parts: [{ text: "Hi, I'm Priya. Where is order #5521?" }] },
    { role: "model", parts: [{ text: "Hi Priya! Order #5521 shipped yesterday and arrives Friday." }] },
    { role: "user", parts: [{ text: "What's my name?" }] },
];

const withHistory = await ai.models.generateContent({
    model: MODEL,
    contents: history,
    config: { systemInstruction: SYSTEM_INSTRUCTION },
});
console.log("B) With history:", withHistory.text);

console.log("A input tokens:", withoutHistory.usageMetadata?.promptTokenCount);
console.log("B input tokens:", withHistory.usageMetadata?.promptTokenCount);