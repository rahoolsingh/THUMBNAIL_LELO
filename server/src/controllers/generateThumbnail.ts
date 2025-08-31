import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "fs";
import { randomUUID } from "crypto";

const ai = new GoogleGenAI({});

const getBase64Images = async (uploadedFiles: any[]): Promise<object[]> => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
        return [];
    }

    const base64Images: Object[] = uploadedFiles.map((file) => {
        const imagePath = file.url.replace("/uploads/", "temp/uploads/");
        const imageData = fs.readFileSync(imagePath);
        const base64Image = {
            inlineData: {
                mimeType: file.mimeType,
                data: imageData.toString("base64"),
            },
        };
        return base64Image;
    });

    return base64Images;
};

const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body;
        const uploadedFiles = req?.uploadedFiles || [];
        const base64Images = await getBase64Images(uploadedFiles);

        const sizeThumbnailImagePath = "white.png";
        const sizeImageData = fs.readFileSync(sizeThumbnailImagePath);
        const sizeImageBase64 = sizeImageData.toString("base64");

        const contents = [
            {
                text:
                    (prompt || "Create a thumbnail for my youtube video") +
                    "\nIMPORTANT: The white image provided is for the size reference. Make sure to follow this 16:9 aspect ratio.",
            },
            {
                inlineData: {
                    mimeType: "image/png",
                    data: sizeImageBase64,
                },
            },
            ...base64Images,
        ];


        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image-preview",
            contents,
            config: {
                responseModalities: ["image"],
            },
        });


        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
            } else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");
                const file = fs.writeFileSync(`temp/generated/${randomUUID()}.png`, buffer);

                return res.status(200).json({
                    success: true,
                    message: part.text || "Thumbnail generated",
                    image: `data:image/png;base64,${imageData}`,
                    prompt: req.body.prompt
                });
            }
        }

    } catch (error: any) {
        console.error("Error generating thumbnails:", error.message);
        return res.status(500).json({ error: "Failed to generate thumbnails" });
    }
};

export default generateThumbnail;
