import multer from "multer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
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
            return callback(new Error("Only JPEG, PNG, WEBP, and JPG files are allowed"));
        }
        callback(null, true);
    },
});
// Middleware function to save files and attach URLs to req
const saveImages = async (req, res, next) => {
    const files = req.files;
    if (!files || files.length === 0) {
        req.uploadedFiles = []; // ✅ Ensure it's always defined
        return next(); // ✅ Prevents further execution
    }
    const uploadedFiles = [];
    for (const file of files) {
        const fileName = randomUUID() + path.extname(file.originalname);
        const filePath = path.join(uploadDir, fileName);
        // Save file to disk
        await fs.promises.writeFile(filePath, file.buffer);
        // Build public URL (if serving uploads folder)
        const url = `/uploads/${fileName}`;
        uploadedFiles.push({
            originalName: file.originalname,
            mimeType: file.mimetype,
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
