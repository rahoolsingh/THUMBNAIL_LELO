import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

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
        files: 5,
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

// Helper → Convert image to 16:9 landscape using sharp
async function convertToLandscape(buffer, width = 1280, height = 720) {
    return sharp(buffer)
        .resize({
            width,
            height,
            fit: "contain", // ✅ Preserve aspect ratio
            background: { r: 0, g: 0, b: 0, alpha: 1 }, // Black bars
        })
        .png() // ✅ Always output safe PNG
        .toBuffer();
}

// Middleware → Save images and convert them to 16:9 landscape PNG
const saveImages = async (req, res, next) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            req.uploadedFiles = [];
            return next();
        }

        const uploadedFiles = [];

        for (const file of files) {
            const fileName = randomUUID() + ".png"; // ✅ Final output always PNG

            // ✅ Convert image into 16:9 landscape PNG
            const processedBuffer = await convertToLandscape(file.buffer);

            // Build URL if needed
            const url = `/uploads/${fileName}`;

            uploadedFiles.push({
                originalName: file.originalname,
                mimeType: "image/png",
                fileName,
                url,
                data: processedBuffer.toString("base64"), // ✅ Base64 PNG
            });
        }

        req.uploadedFiles = uploadedFiles;
        next();
    } catch (error) {
        console.error("Error converting images:", error);
        return res
            .status(500)
            .json({ message: "Image processing failed", error });
    }
};

// Export multer middleware and helper
export const uploadImages = upload.array("images", 5);
export { saveImages, uploadDir };
