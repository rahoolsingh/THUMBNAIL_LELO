import type { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      uploadedFiles?: Express.Multer.File[];
    }
  }
}
export {};
