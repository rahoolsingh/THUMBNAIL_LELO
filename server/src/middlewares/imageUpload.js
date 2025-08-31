import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { createCanvas, loadImage } from "canvas";

// Define the upload directory
const uploadDir = path.join("temp/uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use multer with memory storage
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file
        files: 5, // max 5 files
    },
    fileFilter: (req, file, callback) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/jpg",
        ];
        if (!allowedTypes.includes(file.mimetype)) {
            return callback(
                new Error("Only JPEG, PNG, WEBP, and JPG files are allowed")
            );
        }
        callback(null, true);
    },
});

async function convertToLandscape(
    base64,
    mimeType,
    width = 1280,
    height = 720
) {
    // Some images (like WEBP) may not be supported → convert buffer to PNG first if needed
    let img;
    try {
        img = await loadImage(`data:${mimeType};base64,${base64}`);
    } catch (e) {
        console.warn(
            `⚠️ loadImage failed for ${mimeType}, forcing PNG fallback...`
        );
        img = await loadImage(`data:image/png;base64,${base64}`);
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Fill background black
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);

    // Contain scaling
    const scale = Math.min(width / img.width, height / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const dx = (width - drawWidth) / 2;
    const dy = (height - drawHeight) / 2;

    ctx.drawImage(img, dx, dy, drawWidth, drawHeight);

    // Always output PNG for safe compatibility
    return canvas.toBuffer("image/png").toString("base64");
}

// Middleware → Save uploaded images and convert them to 16:9 landscape
const saveImages = async (req, res, next) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            req.uploadedFiles = [];
            return next();
        }

        const uploadedFiles = [];

        for (const file of files) {
            const fileName = randomUUID() + path.extname(file.originalname);
            const originalBase64 = file.buffer.toString("base64");

            // ✅ Use correct mimeType instead of forcing PNG
            const landscapeBase64 = await convertToLandscape(
                originalBase64,
                file.mimetype
            );

            // Build URL if needed
            const url = `/uploads/${fileName}`;

            uploadedFiles.push({
                originalName: file.originalname,
                mimeType: "image/png", // ✅ Now always outputs PNG thumbnails
                fileName,
                url,
                data: landscapeBase64,
            });
        }

        req.uploadedFiles = uploadedFiles;
        next();
    } catch (error) {
        console.error("Error converting images:", error);
        return res
            .status(500)
            .json({ message: "Image processing failed", error: error.message });
    }
};

// Export multer middleware and helper
export const uploadImages = upload.array("images", 5);
export { saveImages, uploadDir };
