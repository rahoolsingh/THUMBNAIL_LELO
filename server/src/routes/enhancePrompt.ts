import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY, // ✅ Use env var
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const enhancePrompt = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const SYSTEM_PROMPT = `
        You are a professional YouTube thumbnail designer.
        Your task is to improve the user's thumbnail idea by describing exactly how the thumbnail should look.

        Focus on:
        - Background colors and theme
        - Text style and font usage
        - Placement of main objects/images
        - Stickers, logos, icons, or emojis if needed
        - Keep it visually appealing, clean, and NOT cluttered.
    `;

    try {
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: req.body.prompt },
        ];

        const response = await client.chat.completions.create({
            model: "gemini-2.0-flash", // ✅ Gemini model
            messages,
        });

        const rawContent = response.choices[0].message.content || "";
        const content = rawContent.trim();

        req.body.prompt = content;

        next();
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        res.status(500).json({ error: "Failed to enhance prompt" });
    }
};

export default enhancePrompt;
