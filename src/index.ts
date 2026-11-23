const appName: string = "AI Customer Support API";

console.log(`${appName} is starting...`);
console.log(`Running on Node ${process.version}`);

const INPUT_PRICE_PER_MILLION = 1;
const OUTPUT_PRICE_PER_MILLION = 4;

function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}

function estimateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1000000) * INPUT_PRICE_PER_MILLION;
    const outputCost = (outputTokens / 1000000) * OUTPUT_PRICE_PER_MILLION;
    return inputCost + outputCost;
}

const customerMessage = "Hi, my order #1234 has not arrived yet. Can you check the status?";

const inputTokens = estimateTokens(customerMessage);
const outputTokens = inputTokens * 2;
const cost = estimateCost(inputTokens, outputTokens);

console.log(`Message length: ${customerMessage.length} characters`);
console.log(`Estimated input tokens: ${inputTokens}`);
console.log(`Estimated output tokens: ${outputTokens}`);
console.log(`Estimated cost: $${cost.toFixed(6)}`);