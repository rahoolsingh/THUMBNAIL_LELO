import { Router } from "express";

const generateRoutes = Router();

generateRoutes.post("/thumbnail", async (req, res) => {
    // Handle image generation logic here
    res.send({
        success: true,
        message: "Image generated successfully",
        data: req.uploadedFiles,
    });
});

export default generateRoutes;
