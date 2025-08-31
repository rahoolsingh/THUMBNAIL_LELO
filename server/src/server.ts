import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import "dotenv/config";
import cors from "cors";
import generateRoutes from "./routes/generateRoutes.ts";
import { saveImages, uploadImages } from "./middlewares/imageUpload.ts";

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
    generateRoutes
);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
