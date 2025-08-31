import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import "dotenv/config";
import cors from "cors";
import generateRoutes from "./routes/generateRoutes.js";
import { saveImages, uploadImages } from "./middlewares/imageUpload.js";
import enhancePrompt from "./routes/enhancePrompt.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
    cors({
        origin: JSON.parse(process.env.CORS_ORIGIN || "[]"),
        credentials: true,
    })
);
app.use(clerkMiddleware());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use(
    "/api/v1/generate",
    requireAuth(),
    uploadImages,
    saveImages,
    enhancePrompt,
    generateRoutes
);

// MongoDB connection and app listen
mongoose
    .connect(process.env.MONGODB_URI || "")
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error.message}`);
    });
