import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { NextFunction, Request, Response } from "express";

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
    fileFilter: (
        req: Request,
        file: Express.Multer.File,
        callback: multer.FileFilterCallback
    ) => {
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

// Middleware function to save files and attach URLs to req
const saveImages = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return [];
    }

    const uploadedFiles: {
        originalName: string;
        fileName: string;
        url: string;
    }[] = [];

    for (const file of files) {
        const fileName = randomUUID() + path.extname(file.originalname);
        const filePath = path.join(uploadDir, fileName);

        // Save file to disk
        await fs.promises.writeFile(filePath, file.buffer);

        // Build public URL (if serving uploads folder)
        const url = `/uploads/${fileName}`;

        uploadedFiles.push({
            originalName: file.originalname,
            fileName,
            url,
        });
    }

    req.uploadedFiles = uploadedFiles;

    next();
};

// Export multer middleware and helper
export const uploadImages = upload.array("images", 5);
export { saveImages, uploadDir };
