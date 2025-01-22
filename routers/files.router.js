import { Router } from "express";
import { param } from "express-validator";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
import FileController from "../controllers/files/index.js";

const upload = multer({ dest: "uploads/" });
const router = new Router();

router.get("/file/list", authMiddleware, FileController.getFiles);

router.get("/file/:id", authMiddleware, FileController.getFile);

router.post(
  "/file/upload",
  authMiddleware,
  upload.single("file"),
  FileController.uploadFile,
);

router.get("/file/download/:id", authMiddleware, FileController.downloadFile);

router.put(
  "/file/update/:id",
  authMiddleware,
  upload.single("file"),
  FileController.updateFile,
);

router.delete("/file/delete/:id", authMiddleware, FileController.deleteFile);

export default router;
