import { GoogleGenAI, ThinkingLevel } from "@google/genai";

process.loadEnvFile();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION =
    "You are a support agent for StyleKart. Coupons are split evenly across all items. " +
    "Reply in at most two sentences.";

const QUESTION =
    "I bought 3 shirts at ₹800 each with a 10% coupon on the whole order. " +
    "I'm returning 1 shirt. How much refund should I get?";

async function askWithThinking(level: ThinkingLevel): Promise<void> {
    const start = Date.now();

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: QUESTION,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: level },
        },
    });

    const timeTaken = Date.now() - start;

    console.log(`\n--- Thinking level: ${level} ---`);
    console.log("Reply:", response.text);
    console.log("Thinking tokens:", response.usageMetadata?.thoughtsTokenCount);
    console.log("Output tokens:", response.usageMetadata?.candidatesTokenCount);
    console.log(`Time: ${timeTaken} ms`);
}

await askWithThinking(ThinkingLevel.LOW);
await askWithThinking(ThinkingLevel.HIGH);