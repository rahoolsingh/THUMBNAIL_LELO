import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import fs from "fs";
import { randomUUID } from "crypto";
import { getAuth } from "@clerk/express";
import { User } from "../models/usermodel.js";
const ai = new GoogleGenAI({});
const getBase64Images = async (uploadedFiles) => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
        return [];
    }
    const base64Images = uploadedFiles.map((file) => {
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
const generateThumbnail = async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const user = await User.findOne({ userid: userId });
    if (!user) {
        // create in mongodb
        const newUser = new User({
            userid: userId,
        });
        await newUser.save();
    }
    else if (user.freeQuota < 1) {
        return res
            .status(403)
            .json({
            success: false,
            message: "Free quota exceeded",
            error: "User has no free quota left",
        });
    }
    try {
        const { prompt } = req.body;
        const uploadedFiles = req?.uploadedFiles || [];
        const base64Images = await getBase64Images(uploadedFiles);
        const sizeThumbnailImagePath = "white.png";
        const sizeImageData = fs.readFileSync(sizeThumbnailImagePath);
        const sizeImageBase64 = sizeImageData.toString("base64");
        const contents = [
            {
                text: (prompt || "Create a thumbnail for my youtube video") +
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
        const user = await User.findOne({ userid: userId });
        // deduct user free quota
        user.freeQuota -= 1;
        await user.save();
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
            }
            else if (part.inlineData) {
                const imageData = part.inlineData.data;
                const buffer = Buffer.from(imageData, "base64");
                const file = fs.writeFileSync(`temp/generated/${randomUUID()}.png`, buffer);
                return res.status(200).json({
                    success: true,
                    message: part.text || "Thumbnail generated",
                    image: `data:image/png;base64,${imageData}`,
                    prompt: req.body.prompt,
                    quotaLeft: user.freeQuota,
                });
            }
        }
    }
    catch (error) {
        console.error("Error generating thumbnails:", error.message);
        return res.status(500).json({ error: "Failed to generate thumbnails" });
    }
};
export default generateThumbnail;
