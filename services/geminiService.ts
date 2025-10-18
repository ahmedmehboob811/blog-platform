
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function summarizeContent(content: string): Promise<string> {
    if (!API_KEY) {
        return "AI summarization is currently unavailable. API key is not configured.";
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Summarize the following blog post in two or three concise sentences. Here is the post content:\n\n---\n\n${content}`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary:", error);
        return "Failed to generate summary. Please try again later.";
    }
}
