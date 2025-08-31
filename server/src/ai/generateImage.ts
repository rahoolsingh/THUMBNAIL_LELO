import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import fs from "fs";

async function main() {
    const ai = new GoogleGenAI({});

    const imagePath = "file2.webp";
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString("base64");

    const prompt = [
        {
            text: "make the person in the image look like king of the jungle",
        },
        {
            inlineData: {
                mimeType: "image/png",
                data: base64Image,
            },
        },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: prompt,
        config,
    });
    for (const part of response.candidates[0].content.parts) {
        if (part.text) {
        } else if (part.inlineData) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync("gemini-native-image.png", buffer);
        }
    }
}

main();
