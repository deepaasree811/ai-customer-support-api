import { GoogleGenAI, ThinkingLevel } from "@google/genai";

process.loadEnvFile();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION =
    "You are a friendly support agent for StyleKart, a fashion store. " +
    "Returns are accepted within 7 days of delivery if items are unworn with tags. " +
    "Refunds go to the original payment method within 5 business days.";

const start = Date.now();

const stream = await ai.models.generateContentStream({
    model: MODEL,
    contents: "Explain the full return and refund process step by step.",
    config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
});

let chunkCount = 0;
let firstChunkMs: number | null = null;

for await (const chunk of stream) {
    if (firstChunkMs === null) {
        firstChunkMs = Date.now() - start;
    }
    chunkCount++;
    process.stdout.write(chunk.text ?? "");
}

const totalMs = Date.now() - start;

console.log("\n\n--- Stats ---");
console.log(`Chunks received: ${chunkCount}`);
console.log(`Time to first chunk: ${firstChunkMs} ms`);
console.log(`Total time: ${totalMs} ms`);