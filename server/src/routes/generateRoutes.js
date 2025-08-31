import { Router } from "express";
import generateThumbnail from "../controllers/generateThumbnail.ts";
const generateRoutes = Router();
generateRoutes.post("/thumbnail", generateThumbnail);
export default generateRoutes;
