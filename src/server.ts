import express from "express";
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
    "Refunds go to the original payment method within 5 business days. " +
    "Only use these facts. If you don't know something, say a human agent will help. " +
    "Reply in plain text without Markdown.";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
    const message = req.body?.message;

    if (typeof message !== "string" || message.trim() === "") {
        res.status(400).json({ error: 'Send JSON like { "message": "your question" }' });
        return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await ai.models.generateContentStream({
        model: MODEL,
        contents: message,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
    });

    for await (const chunk of stream) {
        const text = chunk.text ?? "";
        if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
        }
    }
    res.write("data: [DONE]\n\n");
    res.end();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});