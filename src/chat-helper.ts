import { GoogleGenAI, ThinkingLevel, type Content } from "@google/genai";

process.loadEnvFile();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Check your .env file.");
}

const ai = new GoogleGenAI({ apiKey });
const MODEL = "gemini-3.6-flash";

const SYSTEM_INSTRUCTION =
    "You are a friendly support agent for StyleKart, a fashion store. " +
    "Address the customer by name if they gave it. " +
    "Returns are accepted within 7 days of delivery if items are unworn with tags. " +
    "Reply in one or two sentences.";

const INPUT_PRICE_PER_MILLION = 1;
const OUTPUT_PRICE_PER_MILLION = 4;

const conversation: Content[] = [];

async function chat(history: Content[], userMessage: string): Promise<string> {
    // a. push the user message onto history
    history.push({ role: "user", parts: [{ text: userMessage }] });
    // b. call Gemini with history, the system instruction and LOW thinking
    const response = await ai.models.generateContent({
        model: MODEL,
        contents: history,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
    });
    const reply = response.text ?? "";
    // c. push the model's reply onto history
    history.push({ role: "model", parts: [{ text: reply }] });

    // d. read the tokens from usageMetadata
    const inputTokens = response.usageMetadata?.promptTokenCount ?? 0;
    const outputTokens = response.usageMetadata?.candidatesTokenCount ?? 0;
    const thinkingTokens = response.usageMetadata?.thoughtsTokenCount ?? 0;

    // e. calculate the estimated cost (thinking is billed as output)
    const inputCost = (inputTokens / 1_000_000) * INPUT_PRICE_PER_MILLION;
    const outputCost = ((outputTokens + thinkingTokens) / 1_000_000) * OUTPUT_PRICE_PER_MILLION;
    const cost = inputCost + outputCost;

    // f. log the tokens and cost
    console.log(
        `  [tokens] input: ${inputTokens}, output: ${outputTokens}, thinking: ${thinkingTokens}, history: ${history.length} messages`,
    );
    console.log(`  [cost] $${cost.toFixed(6)}`);

    // g. return the reply text
    return reply;
}

const reply1 = await chat(conversation, "Hi, I'm Priya.");
console.log("Bot:", reply1);

const reply2 = await chat(conversation, "Can I return a shirt that doesn't fit?");
console.log("Bot:", reply2);

const reply3 = await chat(conversation, "What's my name?");
console.log("Bot:", reply3);