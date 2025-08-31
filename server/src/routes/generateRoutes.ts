import { Router } from "express";
import generateThumbnail from "../controllers/generateThumbnail.js";

const generateRoutes = Router();

generateRoutes.post("/thumbnail", generateThumbnail);

export default generateRoutes;
