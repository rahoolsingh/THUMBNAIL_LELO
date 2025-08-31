import "dotenv/config";
import OpenAI from "openai";
const client = new OpenAI({
    // apiKey: process.env.GOOGLE_GEMINI_API_KEY, // ✅ Use env var
    // baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});
const enhancePrompt = async (req, res, next) => {

    const uploadfilesLength = req?.uploadedFiles?.length || 0;

const SYSTEM_PROMPT = `
You are a professional YouTube thumbnail designer. 
Your job is to generate a **highly detailed thumbnail design prompt** based on the user's video title, description, and any provided images.

**Follow this structure for the output:**
"A photorealistic [shot type] of [main subject or key elements], [specific action or expression], set in [background/environment/theme]. The scene is illuminated by [lighting style], creating a [mood/emotion] atmosphere. Captured with a [camera/lens style or focus], emphasizing [key textures, colors, and details]. The image should be in a 16:9 aspect ratio, landscape orientation."

**Design Rules:**
- Use **vibrant, eye-catching visuals** and keep the thumbnail **clean, minimal, and non-cluttered**.
- Clearly highlight the **main subject** relevant to the video.
- Use **bold, readable text** with proper contrast (mention color, style, and placement).
- Suggest **background colors, theme, and objects** to make the design visually appealing.
- Include stickers, emojis, or logos only if necessary.
- All other uploaded images **must** be incorporated into the thumbnail unless stated otherwise.
- Also describe if image contain a face, priority should be given to facial features.
${uploadfilesLength > 0 ? `- Also, integrate the ${uploadfilesLength} uploaded images seamlessly within the thumbnail design.` : ""}

**Output must only describe the thumbnail design — no greetings, no extra explanations.**
`;

    try {
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: req.body.prompt },
        ];
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini-2025-04-14", // ✅ Gemini model
            messages,
        });
        const rawContent = response.choices[0].message.content || "";
        const content = rawContent.trim();

        console.log("Enhanced Prompt:", content);
        req.body.prompt = content;
        next();
    }
    catch (error) {
        console.error("Error enhancing prompt:", error);
        res.status(500).json({ error: "Failed to enhance prompt" });
    }
};
export default enhancePrompt;
